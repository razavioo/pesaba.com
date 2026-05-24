// Per-page Open Graph image generator (SVG → can be referenced directly in <meta og:image>).
// Returns 1200×630 dark-canvas image with title + type chip + Pesaba mark.
// Usage:  /og/product/g200.svg  ·  /og/article/what-is-aes.svg  ·  /og/glossary/data-diode.svg

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  let slug = getRouterParam(event, 'slug') ?? ''
  // The router captures the trailing ".svg" inside the slug param; strip it.
  if (slug.endsWith('.svg')) slug = slug.slice(0, -4)
  if (!type || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'type and slug required' })
  }

  // Try to look up the title from content; fall back to the slug.
  let title = String(slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  let subtitle = ''

  try {
    const collection = type === 'product' ? 'products'
      : type === 'article' ? 'articles'
      : type === 'glossary' ? 'glossary'
      : type === 'industry' ? 'industries'
      : type === 'use-case' ? 'use-cases'
      : null
    if (collection) {
      const { serverQueryContent } = await import('#content/server')
      const doc: any = await serverQueryContent(event, collection)
        .where({ slug: String(slug) })
        .findOne()
      if (doc?.title) title = String(doc.title)
      if (doc?.short_definition) subtitle = String(doc.short_definition).slice(0, 120)
      else if (doc?.description) subtitle = String(doc.description).slice(0, 120)
    }
  } catch {
    // Best-effort lookup; fall back to slug-derived title.
  }

  const typeLabel = String(type).toUpperCase()
  const escTitle = escapeXml(truncate(title, 80))
  const escSub = escapeXml(subtitle)

  setHeader(event, 'Content-Type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" stroke="#94A1BD" stroke-width="0.5" fill="none" opacity="0.06"/>
    </pattern>
    <radialGradient id="glow" cx="85%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#00E5FF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stop-color="#00E5FF" stop-opacity="0"/>
      <stop offset="50%" stop-color="#00E5FF" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#00E5FF" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#0A0F1A"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Logo / brand mark -->
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="44" height="44" rx="8" fill="#00E5FF" fill-opacity="0.10" stroke="#00E5FF" stroke-opacity="0.30"/>
    <path d="M12 22h20M28 14l8 8-8 8" stroke="#00E5FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="60" y="30" font-family="Geist Sans, Inter, system-ui, sans-serif" font-size="22" font-weight="700" fill="#E2E7F2">Pesaba</text>
  </g>

  <!-- Type chip -->
  <g transform="translate(80, 240)">
    <rect x="0" y="0" width="${10 + typeLabel.length * 9}" height="28" rx="14" fill="#00E5FF" fill-opacity="0.10" stroke="#00E5FF" stroke-opacity="0.40"/>
    <text x="${(10 + typeLabel.length * 9) / 2}" y="19" font-family="JetBrains Mono, monospace" font-size="12" font-weight="600" fill="#4DEFFF" text-anchor="middle" letter-spacing="0.1em">${typeLabel}</text>
  </g>

  <!-- Title -->
  <text x="80" y="340" font-family="Geist Sans, Inter, system-ui, sans-serif" font-size="64" font-weight="800" fill="#E2E7F2" letter-spacing="-0.025em">
    ${wrapText(escTitle, 26).map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 76}">${line}</tspan>`).join('')}
  </text>

  ${escSub ? `<text x="80" y="500" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#94A1BD">
    ${wrapText(escSub, 70).slice(0, 2).map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 30}">${line}</tspan>`).join('')}
  </text>` : ''}

  <!-- Bottom rule -->
  <rect x="80" y="565" width="1040" height="1" fill="url(#rule)"/>

  <!-- Footer -->
  <text x="80" y="595" font-family="JetBrains Mono, monospace" font-size="14" fill="#4A5673" letter-spacing="0.08em">PESABA.COM</text>
  <text x="1120" y="595" font-family="JetBrains Mono, monospace" font-size="14" fill="#4A5673" text-anchor="end" letter-spacing="0.08em">FPGA-NATIVE · MADE IN IRAN</text>
</svg>`
})

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n - 1) + '…'
}

function wrapText(s: string, maxChars: number): string[] {
  const words = s.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    if ((current + ' ' + w).trim().length <= maxChars) {
      current = (current + ' ' + w).trim()
    } else {
      if (current) lines.push(current)
      current = w
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}
