import { serverQueryContent } from '#content/server'
import { createError, defineEventHandler, getQuery, getRouterParam, setHeader } from 'h3'
import sharp from 'sharp'

const CONTENT_COLLECTIONS = {
  product: 'products',
  article: 'articles',
  glossary: 'glossary',
  industry: 'industries',
  'use-case': 'use-cases',
} as const

const CATEGORY_TITLES: Record<string, { fa: string; en: string }> = {
  'data-diodes': { fa: 'دیتادیودها', en: 'Data Diodes' },
  'network-encryption': { fa: 'رمزنگاری شبکه', en: 'Network Encryption' },
  'cellular-monitoring': { fa: 'پایش شبکه سلولی', en: 'Cellular Monitoring' },
  'network-switching-filtering': { fa: 'سوئیچینگ و فیلترینگ شبکه', en: 'Network Switching & Filtering' },
  'telecom-transmission': { fa: 'انتقال مخابراتی', en: 'Telecom Transmission' },
  'bio-monitoring': { fa: 'پایش زیستی', en: 'Biomonitoring' },
}

const TYPE_LABELS: Record<string, { fa: string; en: string }> = {
  site: { fa: 'امنیت سخت‌افزاری', en: 'HARDWARE SECURITY' },
  product: { fa: 'محصول', en: 'PRODUCT' },
  article: { fa: 'مقاله', en: 'ARTICLE' },
  glossary: { fa: 'واژه‌نامه', en: 'GLOSSARY' },
  industry: { fa: 'صنعت', en: 'INDUSTRY' },
  'use-case': { fa: 'راهکار', en: 'USE CASE' },
  category: { fa: 'دسته محصولات', en: 'PRODUCT CATEGORY' },
}

type OgDocument = {
  title?: string
  description?: string
  short_definition?: string
  locale?: string
}

function isContentType(type: string): type is keyof typeof CONTENT_COLLECTIONS {
  return type in CONTENT_COLLECTIONS
}

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type') || ''
  const rawSlug = getRouterParam(event, 'slug') || ''
  const fileMatch = rawSlug.match(/^(.*?)(?:\.(fa|en))?\.(png|svg)$/i)
  const format = fileMatch?.[3].toLowerCase() === 'svg' ? 'svg' : 'png'
  const slug = fileMatch ? fileMatch[1] : rawSlug
  const pathLocale = fileMatch?.[2]?.toLowerCase()
  const requestedLocale = getQuery(event).locale
  const locale = pathLocale === 'fa' || pathLocale === 'en'
    ? pathLocale
    : requestedLocale === 'fa' ? 'fa' : 'en'

  if (!TYPE_LABELS[type] || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug)) {
    throw createError({ statusCode: 404, statusMessage: 'Open Graph image not found' })
  }

  let title = ''
  let subtitle = ''

  if (type === 'site') {
    if (slug !== 'home') throw createError({ statusCode: 404, statusMessage: 'Open Graph image not found' })
    title = locale === 'fa' ? 'پرتو ارتباط صبا' : 'Pesaba'
    subtitle = locale === 'fa'
      ? 'سخت‌افزار برای حفاظت، تفکیک و پایش شبکه‌های حیاتی'
      : 'Hardware for protecting, separating, and monitoring critical networks'
  } else if (type === 'category') {
    const category = CATEGORY_TITLES[slug]
    if (!category) throw createError({ statusCode: 404, statusMessage: 'Open Graph image not found' })
    title = category[locale]
    subtitle = locale === 'fa'
      ? 'محصولات سخت‌افزاری پرتو ارتباط صبا'
      : 'Hardware products by Partov Ertebat Saba'
  } else if (isContentType(type)) {
    const documents = await serverQueryContent(event, CONTENT_COLLECTIONS[type])
      .where({ slug })
      .find() as OgDocument[]
    const document = documents.find(item => locale === 'fa'
      ? item.locale === 'fa'
      : item.locale === 'en' || !item.locale)

    if (!document?.title) {
      throw createError({ statusCode: 404, statusMessage: 'Open Graph image not found' })
    }

    title = document.title
    subtitle = document.short_definition || document.description || ''
  }

  const svg = renderOpenGraphSvg({
    title: truncate(title, 84),
    subtitle: truncate(subtitle, 150),
    label: TYPE_LABELS[type][locale],
    rtl: locale === 'fa',
  })

  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  if (format === 'svg') {
    setHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
    return svg
  }

  const image = await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
  setHeader(event, 'Content-Type', 'image/png')
  return image
})

function renderOpenGraphSvg(options: { title: string; subtitle: string; label: string; rtl: boolean }) {
  const titleLines = wrapText(options.title, options.rtl ? 24 : 28).slice(0, 3)
  const subtitleLines = wrapText(options.subtitle, options.rtl ? 58 : 72).slice(0, 2)
  const textX = options.rtl ? 1120 : 80
  const anchor = options.rtl ? 'end' : 'start'
  const direction = options.rtl ? 'rtl' : 'ltr'
  const fontFamily = options.rtl ? 'DejaVu Sans, sans-serif' : 'Inter, DejaVu Sans, sans-serif'
  const chipWidth = Math.max(104, 36 + Array.from(options.label).length * (options.rtl ? 14 : 9))
  const chipX = options.rtl ? 1120 - chipWidth : 80

  const titleMarkup = titleLines
    .map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : 74}">${escapeXml(line)}</tspan>`)
    .join('')
  const subtitleMarkup = subtitleLines
    .map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : 30}">${escapeXml(line)}</tspan>`)
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" stroke="#94A1BD" stroke-width="0.5" fill="none" opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#093544"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="0" y="0" width="12" height="630" fill="#AAC5D0"/>

  <g transform="translate(80, 72)">
    <rect width="44" height="44" rx="6" fill="#AAC5D0" fill-opacity="0.14" stroke="#AAC5D0" stroke-opacity="0.55"/>
    <path d="M11 22h22M27 14l8 8-8 8" stroke="#D8E7ED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="60" y="30" font-family="Inter, DejaVu Sans, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">Pesaba</text>
  </g>

  <g>
    <rect x="${chipX}" y="218" width="${chipWidth}" height="32" rx="4" fill="#AAC5D0" fill-opacity="0.14" stroke="#AAC5D0" stroke-opacity="0.55"/>
    <text x="${chipX + chipWidth / 2}" y="239" font-family="${fontFamily}" font-size="13" font-weight="700" fill="#D8E7ED" text-anchor="middle" direction="${direction}">${escapeXml(options.label)}</text>
  </g>

  <text x="${textX}" y="330" font-family="${fontFamily}" font-size="62" font-weight="800" fill="#FFFFFF" text-anchor="${anchor}" direction="${direction}">${titleMarkup}</text>
  ${subtitleMarkup ? `<text x="${textX}" y="514" font-family="${fontFamily}" font-size="21" fill="#C4D7DE" text-anchor="${anchor}" direction="${direction}">${subtitleMarkup}</text>` : ''}

  <rect x="80" y="570" width="1040" height="1" fill="#AAC5D0" fill-opacity="0.38"/>
  <text x="80" y="602" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#AAC5D0">PESABA.COM</text>
  <text x="1120" y="602" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#AAC5D0" text-anchor="end">HARDWARE SECURITY</text>
</svg>`
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function truncate(value: string, limit: number) {
  const characters = Array.from(value.trim())
  return characters.length <= limit ? value.trim() : `${characters.slice(0, limit - 1).join('')}…`
}

function wrapText(value: string, maxCharacters: number) {
  const words = value.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (Array.from(candidate).length <= maxCharacters) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    current = word
  }

  if (current) lines.push(current)
  return lines
}
