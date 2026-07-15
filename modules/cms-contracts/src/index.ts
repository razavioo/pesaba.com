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
  to: z.string().trim().min(1).max(240),
  label: localizedStringSchema,
  children: z.array(z.object({ to: z.string().trim().min(1).max(240), label: localizedStringSchema })).default([]),
})

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
