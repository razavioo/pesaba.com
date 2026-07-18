/*
 * Deliberate staging migration for legacy CMS records.  It never publishes a
 * converted record.  Run once without --apply to obtain the reconciliation
 * report, resolve every unresolved media/relation entry, then run against the
 * staging database with --apply.
 */
import { ContentType, PrismaClient, PublicationState, UserRole } from '@prisma/client'
import { contentV2WriteSchema } from '@pesaba/cms-contracts'
import type { ContentBlock, ContentV2Write } from '@pesaba/cms-contracts'

const apply = process.argv.includes('--apply')
const prisma = new PrismaClient()
const families: Record<ContentType, ContentV2Write['family']> = {
  PRODUCT: 'product', INDUSTRY: 'industry', USE_CASE: 'use_case', ARTICLE: 'article', GLOSSARY: 'glossary', COMPANY: 'company', LEGAL: 'legal', PAGE: 'landing_standard',
}
const typeNames: Record<ContentType, ContentV2Write['type']> = {
  PRODUCT: 'product', INDUSTRY: 'industry', USE_CASE: 'use_case', ARTICLE: 'article', GLOSSARY: 'glossary', COMPANY: 'company', LEGAL: 'legal', PAGE: 'page',
}
const categories = new Set(['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring'])

function record(value: unknown): Record<string, unknown> { return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {} }
function specs(value: unknown) { return Array.isArray(value) ? value.flatMap(item => { const row = record(item); return typeof row.label === 'string' && typeof row.value === 'string' ? [{ label: row.label, value: row.value }] : [] }) : [] }
function faq(value: unknown) { return Array.isArray(value) ? value.flatMap(item => { const row = record(item); const question = typeof row.q === 'string' ? row.q : row.question; const answer = typeof row.a === 'string' ? row.a : row.answer; return typeof question === 'string' && typeof answer === 'string' ? [{ question, answer }] : [] }) : [] }
function blocks(translation: { title: string; description: string; body: string; data: unknown }, family: ContentV2Write['family']): ContentBlock[] {
  const data = record(translation.data); const result: ContentBlock[] = [{ id: 'hero', type: 'hero', eyebrow: '', title: translation.title, copy: translation.description || '' }]
  if (translation.body.trim()) result.push({ id: 'overview', type: 'rich_text', markdown: translation.body })
  if (family === 'product' && specs(data.specs).length) result.push({ id: 'specifications', type: 'specification_table', title: 'Specifications', specs: specs(data.specs) })
  if ((family === 'product' || family === 'industry' || family === 'use_case') && faq(data.faqs || data.faq).length) result.push({ id: 'faq', type: 'faq', title: 'FAQ', items: faq(data.faqs || data.faq) })
  return result
}

async function main() {
  const owner = apply ? await prisma.user.findFirst({ where: { role: UserRole.OWNER, active: true }, orderBy: { createdAt: 'asc' } }) : null
  if (apply && !owner) throw new Error('An active Owner is required for an auditable v2 migration.')
  const allItems = await prisma.contentItem.findMany({ include: { translations: true }, orderBy: [{ type: 'asc' }, { slug: 'asc' }] })
  // PostgreSQL JSON-path negation is null-sensitive; filter in process so an
  // empty legacy `{}` reliably remains eligible for the migration.
  const items = allItems.filter(item => record(item.data).contentVersion !== 2)
  const report = { scanned: items.length, valid: 0, unresolvedMedia: 0, unresolvedRelations: 0, failures: [] as Array<{ id: string; slug: string; reason: string }> }
  for (const item of items) {
    try {
      const root = record(item.data)
      const family = item.type === ContentType.PAGE
        ? ({ home: 'landing_home', technology: 'landing_technology', trust: 'landing_trust', firmware: 'landing_firmware' }[item.slug] || families[item.type]) as ContentV2Write['family']
        : families[item.type]
      const category = typeof root.category === 'string' && categories.has(root.category) ? root.category : undefined
      const path = family === 'landing_standard' ? (typeof root.publicPath === 'string' && root.publicPath.startsWith('/') ? root.publicPath : `/${item.slug}`) : undefined
      const candidate: ContentV2Write = contentV2WriteSchema.parse({
        type: typeNames[item.type], slug: item.slug, family, variant: 'migrated', ...(family === 'landing_standard' ? { path } : {}), ...(family === 'product' ? { category } : {}), sortOrder: item.sortOrder,
        translations: item.translations.map(translation => ({ locale: translation.locale, title: translation.title, description: translation.description, seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, blocks: blocks(translation, family) })),
      })
      // Legacy paths and slug relationships cannot be silently converted to
      // asset/content UUIDs.  They remain in the report and must be resolved
      // through the media and relation pickers before review.
      const legacyData = item.translations.map(translation => record(translation.data))
      report.unresolvedMedia += legacyData.reduce((count, data) => count + ['photos', 'images', 'heroImage', 'hero_image', 'diagram', 'schematic_pdf'].filter(key => key in data).length, 0)
      report.unresolvedRelations += legacyData.reduce((count, data) => count + ['products', 'relatedProducts', 'relatedUseCases', 'relatedIndustries'].filter(key => key in data).length, 0)
      report.valid += 1
      if (!apply) continue
      await prisma.$transaction(async tx => {
        await tx.contentRevision.create({ data: { contentItemId: item.id, actorId: owner!.id, snapshot: { version: 1, id: item.id, type: item.type, slug: item.slug, data: item.data, translations: item.translations } } })
        await tx.contentItem.update({ where: { id: item.id }, data: {
          // Preserve the v1 payload while this is a draft.  This is the safe
          // cutover: production stays on the reviewed legacy record until an
          // Owner publishes the corresponding v2 blocks.
          status: item.status, publicationState: PublicationState.DRAFT, pageFamily: candidate.family, variant: candidate.variant,
          data: { ...root, contentVersion: 2, ...(candidate.category ? { category: candidate.category } : {}), ...(candidate.path ? { path: candidate.path } : {}), migrationSource: 'legacy-cms' },
          translations: { deleteMany: {}, create: item.translations.map((legacy, index) => { const translation = candidate.translations[index]; return { locale: translation.locale, title: translation.title, description: translation.description, body: legacy.body, seoTitle: translation.seoTitle, seoDescription: translation.seoDescription, data: legacy.data as object, blocks: translation.blocks as object } }) },
        } })
        await tx.auditEvent.create({ data: { actorId: owner!.id, action: 'content.v2.migrate_draft', entityType: candidate.type, entityId: item.id, metadata: { slug: item.slug, unresolvedMedia: report.unresolvedMedia, unresolvedRelations: report.unresolvedRelations } } })
      })
    } catch (error) { report.failures.push({ id: item.id, slug: item.slug, reason: error instanceof Error ? error.message : String(error) }) }
  }
  console.log(JSON.stringify({ mode: apply ? 'apply-staging-only' : 'dry-run', ...report }, null, 2))
  if (report.failures.length) process.exitCode = 1
}

main().finally(() => prisma.$disconnect())
