import { defineEventHandler, setHeader } from 'h3'

function asBoolean(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl || 'https://pesaba.com').replace(/\/+$/, '')
  const indexable = asBoolean(config.public.siteIndexable)

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  if (!indexable) {
    return 'User-agent: *\nDisallow: /\n'
  }

  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
})
