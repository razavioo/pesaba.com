type PublicTranslation = {
  locale: 'fa' | 'en'
  title: string
  description: string
  body: string
  seoTitle: string
  seoDescription: string
  data: Record<string, unknown>
}

type PublicRecord = {
  id: string
  type: string
  slug: string
  sortOrder: number
  data: Record<string, unknown>
  translation: PublicTranslation
  localizations?: Partial<Record<'fa' | 'en', PublicTranslation>>
  updatedAt: string
}

type FlattenedRecord = Record<string, any> & {
  id: string
  _path: string
  slug: string
  sortOrder: number
  updatedAt: string
  title: string
  description: string
  body: string
  seoTitle: string
  seoDescription: string
}

function flatten(record: PublicRecord): FlattenedRecord {
  return {
    id: record.id,
    _path: `/${record.type}/${record.slug}`,
    slug: record.slug,
    sortOrder: record.sortOrder,
    updatedAt: record.updatedAt,
    locale: record.translation.locale,
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

export function usePublicCms() {
  const config = useRuntimeConfig()
  const base = String(import.meta.server ? config.cmsApiInternalUrl : config.public.cmsApiUrl).replace(/\/$/, '')

  async function list(type: string, locale: 'fa' | 'en') {
    const records = await $fetch(`${base}/public/content/${type}`, { query: { locale } }) as PublicRecord[]
    return records.map(flatten)
  }

  async function get(type: string, slug: string, locale: 'fa' | 'en') {
    const record = await $fetch(`${base}/public/content/${type}/${slug}`, { query: { locale } }) as PublicRecord
    return flatten(record)
  }

  return { list, get }
}
