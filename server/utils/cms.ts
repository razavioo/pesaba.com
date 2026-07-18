import type { H3Event } from 'h3'

export type CmsPublicRecord = {
  id: string
  type: string
  slug: string
  sortOrder: number
  updatedAt: string
  data: Record<string, unknown>
  translation: {
    locale: 'fa' | 'en'
    title: string
    description: string
    body: string
    seoTitle: string
    seoDescription: string
    data: Record<string, unknown>
  }
  localizations?: Partial<Record<'fa' | 'en', CmsPublicRecord['translation']>>
}

export function flattenCmsRecord(record: CmsPublicRecord): Record<string, any> {
  return {
    id: record.id,
    slug: record.slug,
    type: record.type,
    locale: record.translation.locale,
    sortOrder: record.sortOrder,
    updatedAt: record.updatedAt,
    ...record.data,
    ...record.translation.data,
    title_fa: record.localizations?.fa?.title,
    title_en: record.localizations?.en?.title,
    description_fa: record.localizations?.fa?.description,
    description_en: record.localizations?.en?.description,
    localizedData: record.localizations,
    title: record.translation.title,
    description: record.translation.description,
    body: record.translation.body,
    seoTitle: record.translation.seoTitle,
    seoDescription: record.translation.seoDescription,
  }
}

export async function cmsList(event: H3Event, type: string, locale: 'fa' | 'en') {
  const config = useRuntimeConfig(event)
  const base = String(config.cmsApiInternalUrl).replace(/\/$/, '')
  const records = await $fetch(`${base}/public/content/${type}`, { query: { locale } }) as CmsPublicRecord[]
  return records.map(flattenCmsRecord)
}

export async function cmsGet(event: H3Event, type: string, slug: string, locale: 'fa' | 'en') {
  const config = useRuntimeConfig(event)
  const base = String(config.cmsApiInternalUrl).replace(/\/$/, '')
  const record = await $fetch(`${base}/public/content/${type}/${slug}`, { query: { locale } }) as CmsPublicRecord
  return flattenCmsRecord(record)
}
