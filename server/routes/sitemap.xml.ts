import { defineEventHandler, setHeader } from 'h3'
import { cmsList } from '../utils/cms'

type Locale = 'fa' | 'en'
type CmsEntry = Record<string, any> & { slug: string; locale: Locale; updatedAt: string }
type Entry = { path: string; modified?: string; alternates: Partial<Record<Locale, string>> }

const locales: Locale[] = ['fa', 'en']
const hrefLang: Record<Locale, string> = { fa: 'fa-IR', en: 'en-US' }
const staticRoutes = ['', '/products', '/products/compare', '/blog', '/glossary', '/industries', '/use-cases', '/solutions', '/technology', '/resources', '/resources/firmware', '/trust', '/company/about', '/company/careers', '/company/contact', '/company/press', '/legal', '/legal/privacy', '/legal/terms', '/legal/security', '/legal/accessibility']

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function segment(value: unknown) {
  return encodeURIComponent(String(value || '').trim())
}

function modified(value?: string) {
  const time = value ? Date.parse(value) : NaN
  return Number.isNaN(time) ? undefined : new Date(time).toISOString().slice(0, 10)
}

function add(entries: Map<string, Entry>, paths: Partial<Record<Locale, string>>, dates: Partial<Record<Locale, string>> = {}) {
  for (const locale of locales) {
    const path = paths[locale]
    if (!path) continue
    const previous = entries.get(path)
    const nextModified = dates[locale]
    entries.set(path, { path, modified: nextModified && (!previous?.modified || nextModified > previous.modified) ? nextModified : previous?.modified, alternates: { ...previous?.alternates, ...paths } })
  }
}

function pair(records: CmsEntry[]) {
  const groups = new Map<string, Partial<Record<Locale, CmsEntry>>>()
  for (const record of records) groups.set(record.slug, { ...(groups.get(record.slug) || {}), [record.locale]: record })
  return groups
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'https://pesaba.com').replace(/\/+$/, '')
  const collections = await Promise.all(['product', 'article', 'glossary', 'industry', 'use_case'].map(async type => ({
    type,
    records: (await Promise.all(locales.map(locale => cmsList(event, type, locale)))).flat() as CmsEntry[],
  })))
  const entries = new Map<string, Entry>()
  for (const route of staticRoutes) add(entries, { fa: `/fa${route}`, en: `/en${route}` })

  for (const collection of collections) {
    const groups = pair(collection.records)
    for (const records of groups.values()) {
      const fa = records.fa
      const en = records.en
      const item = fa || en
      if (!item) continue
      const category = item.category
      let makePath: (locale: Locale, record: CmsEntry) => string | null
      if (collection.type === 'product') {
        if (!category) continue
        makePath = (locale, record) => `/${locale}/products/${segment(record.category)}/${segment(record.slug)}`
        add(entries, { fa: `/fa/products/${segment(category)}`, en: `/en/products/${segment(category)}` })
      } else if (collection.type === 'article') makePath = (locale, record) => `/${locale}/blog/${segment(record.slug)}`
      else if (collection.type === 'glossary') makePath = (locale, record) => `/${locale}/glossary/${segment(record.slug)}`
      else if (collection.type === 'industry') makePath = (locale, record) => `/${locale}/industries/${segment(record.slug)}`
      else makePath = (locale, record) => `/${locale}/use-cases/${segment(record.slug)}`
      add(entries, {
        ...(fa ? { fa: makePath('fa', fa) || undefined } : {}),
        ...(en ? { en: makePath('en', en) || undefined } : {}),
      }, { fa: modified(fa?.updatedAt), en: modified(en?.updatedAt) })
    }
  }

  const xml = [...entries.values()].sort((a, b) => a.path.localeCompare(b.path)).map((entry) => {
    const links = locales.flatMap(locale => entry.alternates[locale] ? [`    <xhtml:link rel="alternate" hreflang="${hrefLang[locale]}" href="${escapeXml(`${siteUrl}${entry.alternates[locale]}`)}" />`] : [])
    const defaultPath = entry.alternates.fa || entry.alternates.en
    if (defaultPath) links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${siteUrl}${defaultPath}`)}" />`)
    return ['  <url>', `    <loc>${escapeXml(`${siteUrl}${entry.path}`)}</loc>`, ...(entry.modified ? [`    <lastmod>${entry.modified}</lastmod>`] : []), ...links, '  </url>'].join('\n')
  }).join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache, max-age=0, must-revalidate')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${xml}\n</urlset>`
})
