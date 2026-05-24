import { defineEventHandler, setHeader } from 'h3'
import { serverQueryContent } from '#content/server'

function loc(url: string) {
  return `  <url><loc>${url}</loc></url>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const base = ((config.public.siteUrl as string) || 'https://pesaba.com').replace(/\/$/, '')
  const locales = ['fa', 'en']

  const [products, articles, glossary] = await Promise.all([
    serverQueryContent(event, 'products').find(),
    serverQueryContent(event, 'articles').find(),
    serverQueryContent(event, 'glossary').find(),
  ])

  const urls: string[] = []

  // Static pages
  for (const l of locales) {
    urls.push(loc(`${base}/${l}`))
    urls.push(loc(`${base}/${l}/products`))
    urls.push(loc(`${base}/${l}/blog`))
    urls.push(loc(`${base}/${l}/glossary`))
    urls.push(loc(`${base}/${l}/trust`))
    urls.push(loc(`${base}/${l}/company/contact`))
    // Industry pages
    for (const ind of ['power-grid','oil-and-gas','water-utilities','telecom-operators','government','defense','banking-finance','manufacturing']) {
      urls.push(loc(`${base}/${l}/industries/${ind}`))
    }
    // Use-case pages
    for (const uc of ['one-way-data-transfer','aes-256-network-encryption','cellular-quality-monitoring','scada-isolation','ot-it-segmentation','water-toxicity-monitoring']) {
      urls.push(loc(`${base}/${l}/use-cases/${uc}`))
    }
  }

  // Products
  for (const p of products) {
    if (!p.category || !p.slug) continue
    for (const l of locales) {
      urls.push(loc(`${base}/${l}/products/${p.category}/${p.slug}`))
    }
  }

  // Articles
  const seenArticles = new Set<string>()
  for (const a of articles) {
    if (!a.slug || seenArticles.has(a.slug)) continue
    seenArticles.add(a.slug)
    for (const l of locales) {
      urls.push(loc(`${base}/${l}/blog/${a.slug}`))
    }
  }

  // Glossary
  const seenGlossary = new Set<string>()
  for (const g of glossary) {
    if (!g.slug || seenGlossary.has(g.slug)) continue
    seenGlossary.add(g.slug)
    for (const l of locales) {
      urls.push(loc(`${base}/${l}/glossary/${g.slug}`))
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
})
