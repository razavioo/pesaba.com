import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { MediaKind, PrismaClient, UserRole } from '@prisma/client'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { loadConfig } from './config'

const ROOT = path.resolve(__dirname, '../../..')
const PUBLIC_ROOT = path.join(ROOT, 'public')
const supported = new Map([
  ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.webp', 'image/webp'], ['.avif', 'image/avif'], ['.svg', 'image/svg+xml'],
  ['.pdf', 'application/pdf'], ['.mp4', 'video/mp4'], ['.webm', 'video/webm'],
])
const raster = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

function mediaKind(mime: string) {
  if (mime.startsWith('image/')) return MediaKind.IMAGE
  if (mime === 'application/pdf') return MediaKind.DOCUMENT
  if (mime.startsWith('video/')) return MediaKind.VIDEO
  return MediaKind.OTHER
}

async function walk(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(target) : Promise.resolve([target])
  }))
  return nested.flat()
}

async function main() {
  const config = loadConfig()
  const prisma = new PrismaClient()
  const s3 = new S3Client({ endpoint: config.CMS_S3_ENDPOINT, region: config.CMS_S3_REGION, forcePathStyle: true, credentials: { accessKeyId: config.CMS_S3_ACCESS_KEY, secretAccessKey: config.CMS_S3_SECRET_KEY } })
  const owner = await prisma.user.findFirst({ where: { role: UserRole.OWNER, active: true }, orderBy: { createdAt: 'asc' } })
  if (!owner) throw new Error('Create an active Owner before importing media.')
  let imported = 0; let skipped = 0; let duplicates = 0
  for (const file of await walk(PUBLIC_ROOT)) {
    const extension = path.extname(file).toLowerCase()
    const mimeType = supported.get(extension)
    if (!mimeType) continue
    const sourcePath = `/${path.relative(PUBLIC_ROOT, file).split(path.sep).join('/')}`
    const buffer = await fs.readFile(file)
    const checksum = createHash('sha256').update(buffer).digest('hex')
    let asset = await prisma.mediaAsset.findUnique({ where: { sourcePath } })
    if (asset) skipped++
    if (!asset && await prisma.mediaAsset.findUnique({ where: { checksum } })) { duplicates++; continue }
    const key = `legacy${sourcePath}`
    let width: number | null = null; let height: number | null = null
    if (mimeType.startsWith('image/')) {
      try { const meta = await sharp(buffer, { limitInputPixels: 80_000_000 }).metadata(); width = meta.width || null; height = meta.height || null } catch { /* Preserve non-raster SVGs without dimensions. */ }
    }
    if (!asset) {
      await s3.send(new PutObjectCommand({ Bucket: config.CMS_S3_BUCKET, Key: key, Body: buffer, ContentType: mimeType, CacheControl: 'public, max-age=31536000, immutable' }))
      asset = await prisma.mediaAsset.create({ data: { key, checksum, sourcePath, filename: path.basename(file), mimeType, kind: mediaKind(mimeType), bytes: buffer.length, width, height, folder: `/${path.dirname(path.relative(PUBLIC_ROOT, file)).replaceAll(path.sep, '/')}` } })
      await prisma.auditEvent.create({ data: { actorId: owner.id, action: 'migration.media.import', entityType: 'media', entityId: asset.id, metadata: { sourcePath, checksum } } })
      imported++
    }
    if (raster.has(extension)) {
      for (const targetWidth of [480, 960, 1600]) {
        for (const [format, contentType] of [['webp', 'image/webp'], ['avif', 'image/avif']] as const) {
          const output = await sharp(buffer, { limitInputPixels: 80_000_000 }).rotate().resize({ width: targetWidth, withoutEnlargement: true })[format]({ quality: format === 'avif' ? 62 : 80 }).toBuffer({ resolveWithObject: true })
          const variantKey = `${key}-${targetWidth}.${format}`
          if (await prisma.mediaVariant.findUnique({ where: { key: variantKey } })) continue
          await s3.send(new PutObjectCommand({ Bucket: config.CMS_S3_BUCKET, Key: variantKey, Body: output.data, ContentType: contentType, CacheControl: 'public, max-age=31536000, immutable' }))
          await prisma.mediaVariant.create({ data: { mediaAssetId: asset.id, key: variantKey, mimeType: contentType, width: output.info.width, height: output.info.height, bytes: output.info.size } })
        }
      }
    }
  }
  const assets = await prisma.mediaAsset.findMany({ where: { sourcePath: { not: null } }, select: { id: true, sourcePath: true } })
  const references = assets.filter((asset): asset is { id: string; sourcePath: string } => !!asset.sourcePath)
  const usageData: Array<{ mediaAssetId: string; ownerType: string; ownerId: string; field: string }> = []
  const addUsages = (ownerType: string, ownerId: string, field: string, value: unknown) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value)
    for (const asset of references) if (text.includes(asset.sourcePath)) usageData.push({ mediaAssetId: asset.id, ownerType, ownerId, field })
  }
  const [content, settings] = await Promise.all([
    prisma.contentItem.findMany({ include: { translations: true } }),
    prisma.siteSetting.findMany(),
  ])
  for (const item of content) {
    addUsages('content', item.id, 'data', item.data)
    for (const translation of item.translations) { addUsages('content', item.id, `translation.${translation.locale}.data`, translation.data); addUsages('content', item.id, `translation.${translation.locale}.body`, translation.body) }
  }
  for (const setting of settings) addUsages('setting', setting.id, 'data', setting.data)
  if (usageData.length) await prisma.mediaUsage.createMany({ data: usageData, skipDuplicates: true })
  console.log(`Media import complete: ${imported} imported, ${skipped} already tracked, ${duplicates} duplicate files, ${usageData.length} references reconciled.`)
  await prisma.$disconnect()
}

void main().catch(error => { console.error(error); process.exitCode = 1 })
