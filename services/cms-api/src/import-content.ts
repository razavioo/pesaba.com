import fs from 'node:fs/promises'
import path from 'node:path'
import type { Prisma} from '@prisma/client';
import { ContentStatus, ContentType, PrismaClient, UserRole } from '@prisma/client'
import YAML from 'yaml'

type Locale = 'fa' | 'en'
type Translation = { title: string; description: string; body: string; seoTitle: string; seoDescription: string; data: Record<string, unknown> }
type ParsedDocument = { locale: Locale; type: ContentType; slug: string; status: ContentStatus; sortOrder: number; data: Record<string, unknown>; translation: Translation }

const ROOT = path.resolve(__dirname, '../../..')
const CONTENT_ROOT = path.join(ROOT, 'content')
const typeByFolder: Record<string, ContentType> = {
  articles: ContentType.ARTICLE,
  products: ContentType.PRODUCT,
  glossary: ContentType.GLOSSARY,
  industries: ContentType.INDUSTRY,
  'use-cases': ContentType.USE_CASE,
  pages: ContentType.PAGE,
  legal: ContentType.LEGAL,
  company: ContentType.COMPANY,
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function sameJson(first: unknown, second: unknown) {
  return JSON.stringify(first) === JSON.stringify(second)
}

function parseDocument(file: string, source: string): ParsedDocument | null {
  const relative = path.relative(CONTENT_ROOT, file)
  const folder = relative.split(path.sep)[0]
  const type = typeByFolder[folder]
  if (!type) return null
  const locale: Locale = file.endsWith('.fa.md') ? 'fa' : 'en'
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  const frontmatter = match ? recordValue(YAML.parse(match[1])) : {}
  const filename = path.basename(file).replace(/\.fa\.md$|\.md$/, '')
  const slug = stringValue(frontmatter.slug) || filename
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const title = stringValue(frontmatter.title) || stringValue(frontmatter[`title_${locale === 'fa' ? 'fa' : 'en'}`]) || slug
  const description = stringValue(frontmatter.description) || stringValue(frontmatter[`description_${locale}`])
  const sourceBody = match ? match[2].trim() : source.trim()
  const reserved = new Set(['title', 'title_fa', 'title_en', 'description', 'description_fa', 'description_en', 'seo_title', 'seo_description', 'locale', 'slug', 'id', 'active', 'priority'])
  const data = { ...Object.fromEntries(Object.entries(frontmatter).filter(([key]) => !reserved.has(key))), legacyFilename: filename }
  const globalData = Object.fromEntries(Object.entries({ category: frontmatter.category, publicPath: frontmatter.publicPath }).filter(([, value]) => value !== undefined))
  return {
    locale,
    type,
    slug,
    status: frontmatter.active === false ? ContentStatus.INACTIVE : ContentStatus.ACTIVE,
    sortOrder: typeof frontmatter.priority === 'number' ? frontmatter.priority : Number(frontmatter.priority || 0),
    data: globalData,
    translation: { title, description, body: sourceBody, seoTitle: stringValue(frontmatter.seo_title), seoDescription: stringValue(frontmatter.seo_description), data },
  }
}

async function files(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async entry => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return files(entryPath)
    return entry.name.endsWith('.md') ? [entryPath] : []
  }))
  return nested.flat()
}

async function importContent() {
  const prisma = new PrismaClient()
  // The CMS is the runtime source of truth.  This importer is a bootstrap/migration
  // tool, so a routine rerun must never silently replace an editor's work.
  // Set CMS_IMPORT_OVERWRITE=true only for a deliberate source migration.
  const overwrite = process.env.CMS_IMPORT_OVERWRITE === 'true'
  const owner = await prisma.user.findFirst({ where: { role: UserRole.OWNER, active: true }, orderBy: { createdAt: 'asc' } })
  if (!owner) throw new Error('Create an active Owner with `npm run cms:seed` before importing content.')
  const parsed = (await Promise.all((await files(CONTENT_ROOT)).map(async file => parseDocument(file, await fs.readFile(file, 'utf8'))))).filter((item): item is ParsedDocument => !!item)
  const grouped = new Map<string, ParsedDocument[]>()
  for (const item of parsed) grouped.set(`${item.type}:${item.slug}`, [...(grouped.get(`${item.type}:${item.slug}`) || []), item])
  for (const entries of grouped.values()) {
    const first = entries[0]
    const fa = entries.find(item => item.locale === 'fa')
    const en = entries.find(item => item.locale === 'en')
    if (!fa || !en) {
      console.warn(`Skipping ${first.type}:${first.slug}: both fa and en files are required.`)
      continue
    }
    const data = { ...en.data, ...fa.data }
    const existing = await prisma.contentItem.findUnique({ where: { type_slug: { type: first.type, slug: first.slug } }, include: { translations: true } })
    if (existing && !overwrite) continue
    const desired = [
      { locale: 'fa', ...fa.translation, data: fa.translation.data },
      { locale: 'en', ...en.translation, data: en.translation.data },
    ]
    const unchanged = !!existing
      && existing.status === first.status
      && existing.sortOrder === first.sortOrder
      && sameJson(existing.data, data)
      && desired.every(next => {
        const stored = existing.translations.find(item => item.locale === next.locale)
        return !!stored
          && stored.title === next.title
          && stored.description === next.description
          && stored.body === next.body
          && stored.seoTitle === next.seoTitle
          && stored.seoDescription === next.seoDescription
          && sameJson(stored.data, next.data)
      })
    if (unchanged) continue
    const record = await prisma.contentItem.upsert({
      where: { type_slug: { type: first.type, slug: first.slug } },
      create: { type: first.type, slug: first.slug, status: first.status, sortOrder: first.sortOrder, data: data as Prisma.InputJsonValue, translations: { create: [
        { locale: 'fa', ...fa.translation, data: fa.translation.data as Prisma.InputJsonValue }, { locale: 'en', ...en.translation, data: en.translation.data as Prisma.InputJsonValue },
      ] } },
      update: { status: first.status, sortOrder: first.sortOrder, data: data as Prisma.InputJsonValue, translations: { deleteMany: {}, create: [
        { locale: 'fa', ...fa.translation, data: fa.translation.data as Prisma.InputJsonValue }, { locale: 'en', ...en.translation, data: en.translation.data as Prisma.InputJsonValue },
      ] } },
    })
    const stored = await prisma.contentItem.findUniqueOrThrow({ where: { id: record.id }, include: { translations: true } })
    const snapshot = { id: stored.id, type: stored.type, slug: stored.slug, status: stored.status, sortOrder: stored.sortOrder, data: stored.data, translations: stored.translations }
    await prisma.$transaction([
      prisma.contentRevision.create({ data: { contentItemId: record.id, actorId: owner.id, snapshot } }),
      prisma.auditEvent.create({ data: { actorId: owner.id, action: 'migration.import', entityType: first.type, entityId: record.id, metadata: { slug: first.slug } } }),
    ])
  }
  await prisma.$disconnect()
}

void importContent().catch(error => { console.error(error); process.exitCode = 1 })
