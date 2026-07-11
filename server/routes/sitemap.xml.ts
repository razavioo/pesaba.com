import { serverQueryContent } from '#content/server'
import { defineEventHandler, setHeader } from 'h3'

type Locale = 'fa' | 'en'
type ContentDocument = {
  slug?: string
  category?: string
  locale?: string
  active?: boolean
  draft?: boolean
  index?: boolean
  robots?: string
  date?: string
  updated?: string
}
type LocalizedPaths = Partial<Record<Locale, string>>
type LocalizedDates = Partial<Record<Locale, string | undefined>>
type SitemapEntry = {
  path: string
  modified?: string
  alternates: LocalizedPaths
}

const LOCALES: Locale[] = ['fa', 'en']
const HREFLANG: Record<Locale, string> = {
  fa: 'fa-IR',
  en: 'en-US',
}

const STATIC_ROUTES = [
  '',
  '/products',
  '/products/compare',
  '/blog',
  '/glossary',
  '/industries',
  '/use-cases',
  '/solutions',
  '/technology',
  '/resources',
  '/resources/firmware',
  '/trust',
  '/company/about',
  '/company/careers',
  '/company/contact',
  '/company/press',
  '/legal',
  '/legal/privacy',
  '/legal/terms',
  '/legal/security',
  '/legal/accessibility',
]

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function normalizePath(path: string) {
  if (!path.startsWith('/')) path = `/${path}`
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

function encodePathSegment(value: string) {
  try {
    return encodeURIComponent(decodeURIComponent(value))
  } catch {
    return encodeURIComponent(value)
  }
}

function localeOf(document: ContentDocument): Locale {
  return document.locale === 'fa' ? 'fa' : 'en'
}

function isIndexable(document: ContentDocument) {
  return document.active !== false
    && document.draft !== true
    && document.index !== false
    && !String(document.robots || '').toLowerCase().includes('noindex')
}

function lastModified(document: ContentDocument) {
  const value = document.updated || document.date
  if (!value || Number.isNaN(Date.parse(value))) return undefined
  return new Date(value).toISOString().slice(0, 10)
}

function groupLocalizedDocuments(
  documents: ContentDocument[],
  keyFor: (document: ContentDocument) => string | undefined,
  pathFor: (document: ContentDocument, locale: Locale) => string | undefined,
) {
  const groups = new Map<string, { paths: LocalizedPaths, dates: LocalizedDates }>()

  for (const document of documents.filter(isIndexable)) {
    const key = keyFor(document)
    const locale = localeOf(document)
    const path = pathFor(document, locale)
    if (!key || !path) continue

    const group = groups.get(key) || { paths: {}, dates: {} }
    group.paths[locale] = normalizePath(path)
    group.dates[locale] = lastModified(document)
    groups.set(key, group)
  }

  return groups
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = String(config.public.siteUrl || 'https://pesaba.com').replace(/\/+$/, '')

  const [products, articles, glossary, industries, useCases] = await Promise.all([
    serverQueryContent(event, 'products').find() as Promise<ContentDocument[]>,
    serverQueryContent(event, 'articles').find() as Promise<ContentDocument[]>,
    serverQueryContent(event, 'glossary').find() as Promise<ContentDocument[]>,
    serverQueryContent(event, 'industries').find() as Promise<ContentDocument[]>,
    serverQueryContent(event, 'use-cases').find() as Promise<ContentDocument[]>,
  ])

  const entries = new Map<string, SitemapEntry>()
  const addLocalized = (paths: LocalizedPaths, dates: LocalizedDates = {}) => {
    const alternates = Object.fromEntries(
      Object.entries(paths).map(([locale, path]) => [locale, normalizePath(path)]),
    ) as LocalizedPaths

    for (const locale of LOCALES) {
      const path = alternates[locale]
      if (!path) continue

      const existing = entries.get(path)
      const modified = dates[locale]
      entries.set(path, {
        path,
        modified: modified && (!existing?.modified || modified > existing.modified) ? modified : existing?.modified,
        alternates: { ...existing?.alternates, ...alternates },
      })
    }
  }

  for (const route of STATIC_ROUTES) {
    addLocalized({ fa: `/fa${route}`, en: `/en${route}` })
  }

  const productCategories = groupLocalizedDocuments(
    products,
    product => product.category,
    (product, locale) => product.category
      ? `/${locale}/products/${encodePathSegment(product.category)}`
      : undefined,
  )
  const productPages = groupLocalizedDocuments(
    products,
    product => product.category && product.slug ? `${product.category}/${product.slug}` : undefined,
    (product, locale) => product.category && product.slug
      ? `/${locale}/products/${encodePathSegment(product.category)}/${encodePathSegment(product.slug)}`
      : undefined,
  )
  const articlePages = groupLocalizedDocuments(
    articles,
    article => article.slug,
    (article, locale) => article.slug ? `/${locale}/blog/${encodePathSegment(article.slug)}` : undefined,
  )
  const glossaryPages = groupLocalizedDocuments(
    glossary,
    term => term.slug,
    (term, locale) => term.slug ? `/${locale}/glossary/${encodePathSegment(term.slug)}` : undefined,
  )
  const industryPages = groupLocalizedDocuments(
    industries,
    industry => industry.slug,
    (industry, locale) => industry.slug ? `/${locale}/industries/${encodePathSegment(industry.slug)}` : undefined,
  )
  const useCasePages = groupLocalizedDocuments(
    useCases,
    useCase => useCase.slug,
    (useCase, locale) => useCase.slug ? `/${locale}/use-cases/${encodePathSegment(useCase.slug)}` : undefined,
  )

  for (const groups of [productCategories, productPages, articlePages, glossaryPages, industryPages, useCasePages]) {
    for (const { paths, dates } of groups.values()) addLocalized(paths, dates)
  }

  const xmlEntries = [...entries.values()]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map(({ path, modified, alternates }) => {
      const links = LOCALES.flatMap((locale) => {
        const alternatePath = alternates[locale]
        return alternatePath
          ? [`    <xhtml:link rel="alternate" hreflang="${HREFLANG[locale]}" href="${escapeXml(`${base}${alternatePath}`)}" />`]
          : []
      })
      const defaultPath = alternates.fa || alternates.en
      if (defaultPath) {
        links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${base}${defaultPath}`)}" />`)
      }

      return [
        '  <url>',
        `    <loc>${escapeXml(`${base}${path}`)}</loc>`,
        ...(modified ? [`    <lastmod>${escapeXml(modified)}</lastmod>`] : []),
        ...links,
        '  </url>',
      ].join('\n')
    })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlEntries.join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400')
  return xml
})
