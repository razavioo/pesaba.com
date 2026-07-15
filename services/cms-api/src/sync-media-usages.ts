import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  const assets = await prisma.mediaAsset.findMany({ where: { sourcePath: { not: null } }, select: { id: true, sourcePath: true } })
  const references = assets.filter((asset): asset is { id: string; sourcePath: string } => !!asset.sourcePath)
  const usages: Array<{ mediaAssetId: string; ownerType: string; ownerId: string; field: string }> = []
  const inspect = (ownerType: string, ownerId: string, field: string, value: unknown) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value)
    for (const asset of references) if (text.includes(asset.sourcePath)) usages.push({ mediaAssetId: asset.id, ownerType, ownerId, field })
  }
  const [content, settings] = await Promise.all([prisma.contentItem.findMany({ include: { translations: true } }), prisma.siteSetting.findMany()])
  for (const item of content) {
    inspect('content', item.id, 'data', item.data)
    for (const translation of item.translations) { inspect('content', item.id, `translation.${translation.locale}.data`, translation.data); inspect('content', item.id, `translation.${translation.locale}.body`, translation.body) }
  }
  for (const setting of settings) inspect('setting', setting.id, 'data', setting.data)
  if (usages.length) await prisma.mediaUsage.createMany({ data: usages, skipDuplicates: true })
  console.log(`Media usage sync complete: ${usages.length} references scanned.`)
  await prisma.$disconnect()
}

void main().catch(error => { console.error(error); process.exitCode = 1 })
