import { Body, ConflictException, Controller, Delete, Get, Inject, Injectable, NotFoundException, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Prisma} from '@prisma/client';
import { MediaKind, UserRole } from '@prisma/client'
import { createHash, randomUUID } from 'node:crypto'
import path from 'node:path'
import sharp from 'sharp'
import { z } from 'zod'
import { AdminGuard, CurrentUser, CsrfGuard, Roles, RolesGuard } from './auth'
import { loadConfig } from './config'
import { PrismaService } from './prisma.service'

type Actor = { id: string }
type Uploaded = { originalname: string; mimetype: string; size: number; buffer: Buffer }

const metadataSchema = z.object({
  altFa: z.string().max(300).optional(),
  altEn: z.string().max(300).optional(),
  captionFa: z.string().max(500).optional(),
  captionEn: z.string().max(500).optional(),
  focalX: z.coerce.number().min(0).max(1).nullable().optional(),
  focalY: z.coerce.number().min(0).max(1).nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).optional(),
  folder: z.string().trim().min(1).max(160).optional(),
})

function kindFor(mimeType: string): MediaKind {
  if (mimeType.startsWith('image/')) return MediaKind.IMAGE
  if (mimeType === 'application/pdf') return MediaKind.DOCUMENT
  if (mimeType.startsWith('video/')) return MediaKind.VIDEO
  return MediaKind.OTHER
}

function safeFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase().replace(/[^.a-z0-9]/g, '')
  const base = path.basename(filename, path.extname(filename)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'asset'
  return `${base.slice(0, 80)}${extension.slice(0, 12)}`
}

@Injectable()
export class MediaService {
  private readonly config = loadConfig()
  private readonly s3 = new S3Client({
    endpoint: this.config.CMS_S3_ENDPOINT,
    region: this.config.CMS_S3_REGION,
    forcePathStyle: true,
    credentials: { accessKeyId: this.config.CMS_S3_ACCESS_KEY, secretAccessKey: this.config.CMS_S3_SECRET_KEY },
  })

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private publicUrl(key: string) {
    return `${this.config.CMS_S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`
  }

  private serialize(asset: Prisma.MediaAssetGetPayload<{ include: { variants: true; usages: true } }>) {
    return {
      ...asset,
      url: this.publicUrl(asset.key),
      variants: asset.variants.map(variant => ({ ...variant, url: this.publicUrl(variant.key) })),
      usageCount: asset.usages.length,
    }
  }

  async list() {
    const assets = await this.prisma.mediaAsset.findMany({ include: { variants: true, usages: true }, orderBy: { createdAt: 'desc' } })
    return assets.map(asset => this.serialize(asset))
  }

  async upload(file: Uploaded, input: Record<string, unknown>, actor: Actor) {
    if (!file?.buffer || !file.mimetype) throw new NotFoundException('A file is required.')
    if (file.size > 50 * 1024 * 1024) throw new ConflictException('Files must be 50 MB or smaller.')
    const metadata = metadataSchema.parse({ ...input, tags: typeof input.tags === 'string' ? JSON.parse(input.tags) : input.tags })
    const checksum = createHash('sha256').update(file.buffer).digest('hex')
    const duplicate = await this.prisma.mediaAsset.findUnique({ where: { checksum } })
    if (duplicate) throw new ConflictException(`This file already exists in the media library (${duplicate.filename}).`)
    const filename = safeFilename(file.originalname)
    const folder = (metadata.folder || '/uploads').replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '') || 'uploads'
    const id = randomUUID()
    const key = `${folder}/${id}/${filename}`
    const kind = kindFor(file.mimetype)
    let width: number | null = null
    let height: number | null = null
    if (kind === MediaKind.IMAGE) {
      const details = await sharp(file.buffer, { limitInputPixels: 80_000_000 }).metadata()
      width = details.width || null
      height = details.height || null
    }
    await this.s3.send(new PutObjectCommand({ Bucket: this.config.CMS_S3_BUCKET, Key: key, Body: file.buffer, ContentType: file.mimetype, CacheControl: 'public, max-age=31536000, immutable' }))
    const asset = await this.prisma.mediaAsset.create({
      data: {
        id,
        key,
        checksum,
        filename,
        mimeType: file.mimetype,
        kind,
        bytes: file.size,
        width,
        height,
        altFa: metadata.altFa || '',
        altEn: metadata.altEn || '',
        captionFa: metadata.captionFa || '',
        captionEn: metadata.captionEn || '',
        focalX: metadata.focalX ?? null,
        focalY: metadata.focalY ?? null,
        tags: metadata.tags || [],
        folder: `/${folder}`,
      },
      include: { variants: true, usages: true },
    })
    if (kind === MediaKind.IMAGE) await this.createVariants(asset.id, key, file.buffer)
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'media.upload', entityType: 'media', entityId: asset.id, metadata: { filename } } })
    return this.get(asset.id)
  }

  private async createVariants(assetId: string, sourceKey: string, buffer: Buffer) {
    for (const width of [480, 960, 1600]) {
      for (const [format, mimeType] of [['webp', 'image/webp'], ['avif', 'image/avif']] as const) {
        const output = await sharp(buffer, { limitInputPixels: 80_000_000 }).rotate().resize({ width, withoutEnlargement: true })[format]({ quality: format === 'avif' ? 62 : 80 }).toBuffer({ resolveWithObject: true })
        const key = `${sourceKey}-${width}.${format}`
        await this.s3.send(new PutObjectCommand({ Bucket: this.config.CMS_S3_BUCKET, Key: key, Body: output.data, ContentType: mimeType, CacheControl: 'public, max-age=31536000, immutable' }))
        await this.prisma.mediaVariant.create({ data: { mediaAssetId: assetId, key, mimeType, width: output.info.width, height: output.info.height, bytes: output.info.size } })
      }
    }
  }

  async get(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id }, include: { variants: true, usages: true } })
    if (!asset) throw new NotFoundException('Media asset not found.')
    return this.serialize(asset)
  }

  async publicAsset(id: string, locale: 'fa' | 'en') {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id }, include: { variants: true, usages: false } })
    if (!asset) throw new NotFoundException('Media asset not found.')
    return {
      id: asset.id, kind: asset.kind.toLowerCase(), mimeType: asset.mimeType, width: asset.width, height: asset.height,
      url: this.publicUrl(asset.key), alt: locale === 'fa' ? asset.altFa : asset.altEn,
      variants: asset.variants.map(variant => ({ width: variant.width, mimeType: variant.mimeType, url: this.publicUrl(variant.key) })),
    }
  }

  async update(id: string, input: unknown, actor: Actor) {
    const data = metadataSchema.parse(input)
    const asset = await this.prisma.mediaAsset.update({ where: { id }, data, include: { variants: true, usages: true } })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'media.update', entityType: 'media', entityId: id } })
    return this.serialize(asset)
  }

  async remove(id: string, actor: Actor) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id }, include: { variants: true, usages: true } })
    if (!asset) throw new NotFoundException('Media asset not found.')
    if (asset.usages.length) throw new ConflictException('This file is in use and cannot be deleted.')
    await Promise.all([this.s3.send(new DeleteObjectCommand({ Bucket: this.config.CMS_S3_BUCKET, Key: asset.key })), ...asset.variants.map(variant => this.s3.send(new DeleteObjectCommand({ Bucket: this.config.CMS_S3_BUCKET, Key: variant.key })))])
    await this.prisma.mediaAsset.delete({ where: { id } })
    await this.prisma.auditEvent.create({ data: { actorId: actor.id, action: 'media.delete', entityType: 'media', entityId: id } })
    return { ok: true }
  }
}

@Controller('public/media')
export class PublicMediaController {
  constructor(private readonly media: MediaService) {}
  @Get(':id')
  get(@Param('id') id: string, @Query('locale') locale: 'fa' | 'en' = 'fa') { return this.media.publicAsset(id, locale === 'en' ? 'en' : 'fa') }
}

@Controller('admin/media')
@UseGuards(AdminGuard, RolesGuard, CsrfGuard)
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  list() {
    return this.media.list()
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.media.get(id)
  }

  @Post('upload')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  upload(@UploadedFile() file: Uploaded, @Body() body: Record<string, unknown>, @CurrentUser() user: Actor) {
    return this.media.upload(file, body, user)
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  update(@Param('id') id: string, @Body() body: unknown, @CurrentUser() user: Actor) {
    return this.media.update(id, body, user)
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.EDITOR)
  remove(@Param('id') id: string, @CurrentUser() user: Actor) {
    return this.media.remove(id, user)
  }
}
