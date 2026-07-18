import type { ContentBlock } from '@pesaba/cms-contracts'

export type PublicContentV2 = {
  id: string; type: string; slug: string; family: string; variant: string; category?: string; path?: string; sortOrder: number; updatedAt: string
  translation: { locale: 'fa' | 'en'; title: string; description: string; seoTitle: string; seoDescription: string; blocks: ContentBlock[] }
}
export type PublicContentReference = { id: string; type: string; title: string; description: string; path: string }
export type PublicMedia = { id: string; kind: string; mimeType: string; width: number | null; height: number | null; url: string; alt: string; variants: Array<{ width: number | null; mimeType: string; url: string }> }

export function usePublicCmsV2() {
  const config = useRuntimeConfig()
  const base = String(import.meta.server ? config.cmsApiInternalUrl : config.public.cmsApiUrl).replace(/\/$/, '')
  const get = (type: string, slug: string, locale: 'fa' | 'en', previewToken?: string) => previewToken
    ? $fetch(`${base}/public/v2/content/preview/${encodeURIComponent(previewToken)}`, { query: { locale } }) as Promise<PublicContentV2>
    : $fetch(`${base}/public/v2/content/${type}/${slug}`, { query: { locale } }) as Promise<PublicContentV2>
  const list = (type: string, locale: 'fa' | 'en') => $fetch(`${base}/public/v2/content/${type}`, { query: { locale } }) as Promise<PublicContentV2[]>
  const getPageByPath = (path: string, locale: 'fa' | 'en') => $fetch(`${base}/public/v2/content/page/by-path`, { query: { path, locale } }) as Promise<PublicContentV2>
  const references = (ids: string[], locale: 'fa' | 'en') => ids.length
    ? $fetch(`${base}/public/v2/content/references`, { query: { ids: ids.join(','), locale } }) as Promise<PublicContentReference[]>
    : Promise.resolve([])
  const media = (id: string, locale: 'fa' | 'en') => $fetch(`${base}/public/media/${id}`, { query: { locale } }) as Promise<PublicMedia>
  return { get, list, getPageByPath, references, media }
}
