import { defineEventHandler, setHeader } from 'h3'
import { cmsList } from '../utils/cms'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string) || 'https://pesaba.com'

  const articles = (await Promise.all([
    cmsList(event, 'article', 'fa'),
    cmsList(event, 'article', 'en'),
  ])).flat().sort((first: any, second: any) => String(second.date || second.updatedAt).localeCompare(String(first.date || first.updatedAt))).slice(0, 20)

  const items = articles.map((a) => {
    const locale = a.locale === 'fa' ? 'fa' : 'en'
    const url = `${siteUrl}/${locale}/blog/${a.slug}`
    const date = a.date ? new Date(String(a.date)).toUTCString() : new Date(a.updatedAt).toUTCString()
    return `
  <item>
    <title><![CDATA[${a.title || ''}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${date}</pubDate>
    <description><![CDATA[${a.description || ''}]]></description>
    ${a.image ? `<enclosure url="${a.image}" type="image/webp" length="0"/>` : ''}
    <language>${locale === 'fa' ? 'fa-IR' : 'en'}</language>
  </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pesaba — Technical Articles</title>
    <link>${siteUrl}</link>
    <description>Technical articles on encryption, OT security, cellular monitoring, and critical infrastructure hardware.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>admin@pesaba.com (Pesaba Engineering)</managingEditor>
    <webMaster>admin@pesaba.com</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return xml
})
