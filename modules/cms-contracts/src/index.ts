import { z } from 'zod'

export const locales = ['fa', 'en'] as const
export const contentTypes = ['article', 'product', 'glossary', 'industry', 'use_case', 'page', 'legal', 'company'] as const
export const contentStatuses = ['active', 'inactive', 'archived'] as const

export const localeSchema = z.enum(locales)
export const contentTypeSchema = z.enum(contentTypes)
export const contentStatusSchema = z.enum(contentStatuses)

export const localizedContentSchema = z.object({
  locale: localeSchema,
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().max(500).default(''),
  body: z.string().default(''),
  seoTitle: z.string().trim().max(180).default(''),
  seoDescription: z.string().trim().max(320).default(''),
  data: z.record(z.string(), z.unknown()).default({}),
})

export const contentItemSchema = z.object({
  id: z.string().uuid(),
  type: contentTypeSchema,
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens.'),
  status: contentStatusSchema,
  sortOrder: z.number().int().default(0),
  data: z.record(z.string(), z.unknown()).default({}),
  translations: z.array(localizedContentSchema).length(2),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const contentWriteSchema = contentItemSchema.pick({
  type: true,
  slug: true,
  status: true,
  sortOrder: true,
  data: true,
  translations: true,
})

export const settingsWriteSchema = z.object({
  namespace: z.string().trim().min(1).max(80),
  data: z.record(z.string(), z.unknown()),
})

const localizedStringSchema = z.object({ fa: z.string(), en: z.string() })
const navigationItemSchema = z.object({
  key: z.string().trim().min(1).max(80),
  to: z.string().trim().max(240).default(''),
  targetId: z.string().uuid().optional(),
  label: localizedStringSchema,
  children: z.array(z.object({ to: z.string().trim().max(240).default(''), targetId: z.string().uuid().optional(), label: localizedStringSchema }).refine(item => Boolean(item.to) !== Boolean(item.targetId), 'Provide either an internal target or an external URL.')).default([]),
}).refine(item => Boolean(item.to) !== Boolean(item.targetId), 'Provide either an internal target or an external URL.')

export const contactSettingsSchema = z.object({
  phone: z.string().trim().min(1).max(50),
  phoneDisplay: localizedStringSchema,
  email: z.string().trim().email(),
  address: localizedStringSchema,
  mapUrl: z.string().url().or(z.literal('')).default(''),
  linkedinUrl: z.string().url().or(z.literal('')).default(''),
  recipients: z.object({ sales: z.string(), support: z.string(), partnership: z.string() }),
  formEnabled: z.boolean().default(true),
})

export const contactOperationsSettingsSchema = z.object({
  recipients: z.object({ sales: z.string().trim().email().or(z.literal('')), support: z.string().trim().email().or(z.literal('')), partnership: z.string().trim().email().or(z.literal('')) }),
  formEnabled: z.boolean().default(true),
})

export const navigationSettingsSchema = z.object({
  header: z.array(navigationItemSchema).default([]),
  footer: z.array(z.object({ title: localizedStringSchema, items: z.array(navigationItemSchema) })).default([]),
  legal: z.array(navigationItemSchema).default([]),
})

export const brandingSettingsSchema = z.object({
  name: localizedStringSchema,
  tagline: localizedStringSchema,
  footerTagline: localizedStringSchema,
  logoUrl: z.string().max(500).default('/pesaba-mark.svg'),
})

export const seoSettingsSchema = z.object({
  defaultTitle: localizedStringSchema,
  defaultDescription: localizedStringSchema,
  defaultImageUrl: z.string().max(500).default(''),
  twitterHandle: z.string().trim().max(100).default(''),
})

export type ContactSettings = z.infer<typeof contactSettingsSchema>
export type ContactOperationsSettings = z.infer<typeof contactOperationsSettingsSchema>
export type NavigationSettings = z.infer<typeof navigationSettingsSchema>
export type BrandingSettings = z.infer<typeof brandingSettingsSchema>
export type SeoSettings = z.infer<typeof seoSettingsSchema>

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(256),
})

export const userRoleSchema = z.enum(['OWNER', 'EDITOR', 'VIEWER'])
export type ContentItem = z.infer<typeof contentItemSchema>
export type ContentWrite = z.infer<typeof contentWriteSchema>
export type LocalizedContent = z.infer<typeof localizedContentSchema>
export type UserRole = z.infer<typeof userRoleSchema>

// ─── Content v2 ──────────────────────────────────────────────────────────
// V1 deliberately accepted arbitrary JSON because it was a bridge from the
// markdown import.  V2 is the editor-facing contract: a page is assembled
// from a small, validated vocabulary, not from unbounded JSON or executable
// markdown conventions.
export const publicationStates = ['draft', 'in_review', 'published', 'archived'] as const
export const publicationStateSchema = z.enum(publicationStates)
export const pageFamilies = [
  'product', 'industry', 'use_case', 'article', 'glossary', 'company', 'legal',
  'landing_home', 'landing_technology', 'landing_trust', 'landing_firmware', 'landing_standard',
] as const
export const pageFamilySchema = z.enum(pageFamilies)
export const productCategorySchema = z.enum(['data-diodes', 'network-encryption', 'network-switching-filtering', 'telecom-transmission', 'cellular-monitoring', 'bio-monitoring'])

const blockIdSchema = z.string().trim().min(1).max(80).regex(/^[a-z][a-z0-9-]*$/, 'Block id must use lowercase letters, numbers, and hyphens.')
const contentIdSchema = z.string().uuid()
const mediaIdSchema = z.string().uuid()
const hrefSchema = z.string().trim().max(500).refine(value => /^(?:https?:\/\/|mailto:|tel:|\/|#)/.test(value), 'Link must be an absolute URL, site path, mailto, tel, or anchor.')
export const managedPathSchema = z.string().trim().min(2).max(240).regex(/^\/[a-z0-9]+(?:[a-z0-9-]*(?:\/[a-z0-9]+[a-z0-9-]*)*)?$/, 'Path must start with / and use lowercase letters, numbers, hyphens, and slashes.')
const headingSchema = z.string().trim().min(1).max(180)
const copySchema = z.string().trim().max(10_000)
const shortCopySchema = z.string().trim().max(500)
const ctaSchema = z.object({ label: headingSchema, href: hrefSchema, style: z.enum(['primary', 'secondary', 'outline']).default('primary') }).strict()
const mediaRefSchema = z.object({ assetId: mediaIdSchema, alt: z.string().trim().max(300).default('') }).strict()
const contentRefSchema = z.object({ contentId: contentIdSchema }).strict()
const blockDesignSchema = z.object({
  variant: z.enum(['standard', 'compact', 'feature']).default('standard'),
  surface: z.enum(['default', 'muted', 'dark', 'accent']).default('default'),
  width: z.enum(['default', 'narrow', 'wide']).default('default'),
  align: z.enum(['start', 'center']).default('start'),
  spacing: z.enum(['normal', 'compact', 'generous']).default('normal'),
  columns: z.enum(['auto', '2', '3', '4']).default('auto'),
}).strict().default({ variant: 'standard', surface: 'default', width: 'default', align: 'start', spacing: 'normal', columns: 'auto' })

const blockBase = { id: blockIdSchema, anchor: z.string().trim().max(80).regex(/^[a-z][a-z0-9-]*$/).optional(), design: blockDesignSchema.optional() }
export const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({ ...blockBase, type: z.literal('hero'), eyebrow: z.string().trim().max(100).default(''), title: headingSchema, copy: shortCopySchema.default(''), media: mediaRefSchema.optional(), primaryCta: ctaSchema.optional(), secondaryCta: ctaSchema.optional() }).strict(),
  z.object({ ...blockBase, type: z.literal('rich_text'), title: headingSchema.optional(), markdown: copySchema }).strict(),
  z.object({ ...blockBase, type: z.literal('media_text'), title: headingSchema, copy: copySchema, media: mediaRefSchema, reverse: z.boolean().default(false), cta: ctaSchema.optional() }).strict(),
  z.object({ ...blockBase, type: z.literal('card_grid'), title: headingSchema, cards: z.array(z.object({ title: headingSchema, copy: shortCopySchema, media: mediaRefSchema.optional(), cta: ctaSchema.optional() }).strict()).min(1).max(12) }).strict(),
  z.object({ ...blockBase, type: z.literal('collection'), title: headingSchema, collection: z.enum(['products', 'articles', 'industries', 'use_cases', 'glossary']), items: z.array(contentRefSchema).min(1).max(12), cta: ctaSchema.optional() }).strict(),
  z.object({ ...blockBase, type: z.literal('specification_table'), title: headingSchema, specs: z.array(z.object({ label: headingSchema, value: z.string().trim().min(1).max(500) }).strict()).min(1).max(80) }).strict(),
  z.object({ ...blockBase, type: z.literal('download_list'), title: headingSchema, downloads: z.array(z.object({ label: headingSchema, media: mediaRefSchema, note: z.string().trim().max(300).default('') }).strict()).min(1).max(20) }).strict(),
  z.object({ ...blockBase, type: z.literal('faq'), title: headingSchema.optional(), items: z.array(z.object({ question: headingSchema, answer: copySchema }).strict()).min(1).max(20) }).strict(),
  z.object({ ...blockBase, type: z.literal('stat_grid'), title: headingSchema.optional(), stats: z.array(z.object({ value: z.string().trim().min(1).max(50), label: headingSchema }).strict()).min(1).max(8) }).strict(),
  z.object({ ...blockBase, type: z.literal('related_links'), title: headingSchema, items: z.array(z.object({ label: headingSchema, target: contentRefSchema.optional(), href: hrefSchema.optional(), copy: shortCopySchema.default('') }).strict().refine(item => Boolean(item.target) !== Boolean(item.href), 'Provide exactly one related target or URL.')).min(1).max(12) }).strict(),
  z.object({ ...blockBase, type: z.literal('notice'), tone: z.enum(['info', 'warning', 'evidence']), title: headingSchema.optional(), copy: shortCopySchema }).strict(),
  z.object({ ...blockBase, type: z.literal('cta'), title: headingSchema, copy: shortCopySchema.default(''), primaryCta: ctaSchema, secondaryCta: ctaSchema.optional() }).strict(),
])

export type ContentBlock = z.infer<typeof contentBlockSchema>

const allowedBlocks: Record<z.infer<typeof pageFamilySchema>, readonly ContentBlock['type'][]> = {
  product: ['hero', 'rich_text', 'media_text', 'specification_table', 'download_list', 'faq', 'related_links', 'notice', 'cta'],
  industry: ['hero', 'rich_text', 'media_text', 'collection', 'faq', 'related_links', 'notice', 'cta'],
  use_case: ['hero', 'rich_text', 'media_text', 'collection', 'faq', 'related_links', 'notice', 'cta'],
  article: ['hero', 'rich_text', 'related_links', 'notice', 'cta'],
  glossary: ['hero', 'rich_text', 'related_links', 'notice'],
  company: ['hero', 'rich_text', 'media_text', 'card_grid', 'stat_grid', 'notice', 'cta'],
  legal: ['hero', 'rich_text', 'notice'],
  landing_home: ['hero', 'rich_text', 'media_text', 'collection', 'card_grid', 'stat_grid', 'notice', 'cta'],
  landing_technology: ['hero', 'rich_text', 'media_text', 'card_grid', 'notice', 'cta'],
  landing_trust: ['hero', 'rich_text', 'media_text', 'card_grid', 'related_links', 'notice', 'cta'],
  landing_firmware: ['hero', 'rich_text', 'media_text', 'card_grid', 'notice', 'cta'],
  landing_standard: ['hero', 'rich_text', 'media_text', 'card_grid', 'collection', 'faq', 'notice', 'cta'],
}

export const allowedBlocksForFamily = (family: z.infer<typeof pageFamilySchema>) => allowedBlocks[family]
const v2TranslationSchema = z.object({
  locale: localeSchema,
  title: headingSchema,
  description: z.string().trim().max(500).default(''),
  seoTitle: z.string().trim().max(180).default(''),
  seoDescription: z.string().trim().max(320).default(''),
  blocks: z.array(contentBlockSchema).min(1).max(30),
}).strict()

function validateBlockSet(value: { family: z.infer<typeof pageFamilySchema>, translations: Array<z.infer<typeof v2TranslationSchema>> }, ctx: z.RefinementCtx) {
  const locales = new Set(value.translations.map(translation => translation.locale))
  if (locales.size !== 2 || !locales.has('fa') || !locales.has('en')) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['translations'], message: 'Persian and English translations are both required.' })
  const reference = value.translations[0]?.blocks || []
  const expectedIds = reference.map(block => `${block.id}:${block.type}`).join('|')
  for (const [translationIndex, translation] of value.translations.entries()) {
    const ids = new Set<string>()
    for (const [blockIndex, block] of translation.blocks.entries()) {
      if (ids.has(block.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['translations', translationIndex, 'blocks', blockIndex, 'id'], message: 'Block ids must be unique per translation.' })
      ids.add(block.id)
      if (!allowedBlocks[value.family].includes(block.type)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['translations', translationIndex, 'blocks', blockIndex, 'type'], message: `${block.type} is not allowed for ${value.family}.` })
    }
    if (translation.blocks.map(block => `${block.id}:${block.type}`).join('|') !== expectedIds) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['translations', translationIndex, 'blocks'], message: 'Both locales must have the same block structure and order.' })
  }
  if (value.family !== 'legal' && !reference.some(block => block.type === 'hero')) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['translations', 0, 'blocks'], message: 'This page family requires a hero block.' })
}

export const contentV2WriteSchema = z.object({
  type: contentTypeSchema,
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens.'),
  family: pageFamilySchema,
  variant: z.string().trim().min(1).max(80).regex(/^[a-z][a-z0-9-]*$/),
  path: managedPathSchema.optional(),
  category: productCategorySchema.optional(),
  sortOrder: z.number().int().default(0),
  translations: z.array(v2TranslationSchema).length(2),
}).strict().superRefine((value, ctx) => {
  validateBlockSet(value, ctx)
  if (value.family === 'product' && !value.category) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['category'], message: 'Products require a valid category.' })
  if (value.family !== 'product' && value.category) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['category'], message: 'Only products can have a product category.' })
  if (value.family === 'landing_standard' && !value.path) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['path'], message: 'Standard pages require a public path.' })
  if (value.family !== 'landing_standard' && value.path) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['path'], message: 'Only standard pages can set a custom public path.' })
})

export type ContentV2Write = z.infer<typeof contentV2WriteSchema>
