#!/usr/bin/env tsx
/**
 * generate-redirects.ts
 * Reads ../data/manifest.json (all old URLs) and writes
 * server/middleware/redirects.ts mapping old → new kebab-case slugs.
 */

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DATA = path.resolve(ROOT, '../data')

function kebab(s: string): string {
  return decodeURIComponent(s)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w/-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Known product slug remappings (old nameEng → new kebab slug)
const PRODUCT_REMAP: Record<string, string> = {
  'data diode a10':   'a10',
  'data diode a100':  'a100',
  'data diode g200':  'g200',
  'data diode g300':  'g300',
  'data diode k200':  'k200',
  'emx-4':            'emx-4',
  'emx-5':            'emx-5',
  'emx-6':            'emx-6',
  'upcryptor':        'upcryptor',
  'corn e1':          'corn-e1',
  'corn stm1':        'corn-stm1',
  'sdx':              'sdx',
  'auriga':           'auriga',
  'capella':          'capella',
  'saturn':           'saturn',
  'venus challenger': 'venus-challenger',
  'venus netsens':    'venus-netsens',
  'venus pioneer':    'venus-pioneer',
  'orazan':           'orazan',
}

const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  'a10':              'data-diodes',
  'a100':             'data-diodes',
  'g200':             'data-diodes',
  'g300':             'data-diodes',
  'k200':             'data-diodes',
  'emx-4':            'network-switching-filtering',
  'emx-5':            'network-switching-filtering',
  'emx-6':            'network-encryption',
  'upcryptor':        'network-encryption',
  'corn-e1':          'telecom-transmission',
  'corn-stm1':        'telecom-transmission',
  'sdx':              'telecom-transmission',
  'auriga':           'cellular-monitoring',
  'capella':          'cellular-monitoring',
  'saturn':           'cellular-monitoring',
  'venus-challenger': 'cellular-monitoring',
  'venus-netsens':    'cellular-monitoring',
  'venus-pioneer':    'cellular-monitoring',
  'orazan':           'bio-monitoring',
}

interface ManifestEntry {
  url: string
  type?: string
  locale?: string
}

function mapOldUrl(url: string): string | null {
  const decoded = decodeURIComponent(url).replace(/\s+/g, '-').toLowerCase()

  // /fa/products/... or /en/products/...
  const prodMatch = decoded.match(/^\/(fa|en)\/products?\/([\w\s-]+)\/?$/)
  if (prodMatch) {
    const locale = prodMatch[1]
    const rawName = prodMatch[2].replace(/-+/g, ' ').trim()
    for (const [pattern, newSlug] of Object.entries(PRODUCT_REMAP)) {
      if (rawName.includes(pattern) || pattern.includes(rawName)) {
        const cat = PRODUCT_CATEGORY_MAP[newSlug]
        return `/${locale}/products/${cat}/${newSlug}`
      }
    }
  }

  // /fa/articles/... or /en/articles/...
  const articleMatch = decoded.match(/^\/(fa|en)\/articles?\/([\w\s-]+)\/?$/)
  if (articleMatch) {
    const locale = articleMatch[1]
    const articleSlug = kebab(articleMatch[2])
    return `/${locale}/blog/${articleSlug}`
  }

  // /fa or /en root
  if (decoded === '/fa' || decoded === '/fa/') return '/fa'
  if (decoded === '/en' || decoded === '/en/') return '/en'

  // /fa/contact-us → /fa/company/contact
  if (decoded.includes('contact')) return `/${decoded.split('/')[1] || 'fa'}/company/contact`

  // /fa/about → /fa/company/about
  if (decoded.includes('about')) return `/${decoded.split('/')[1] || 'fa'}/company/about`

  return null
}

const manifest: ManifestEntry[] = JSON.parse(
  fs.readFileSync(path.join(DATA, 'manifest.json'), 'utf-8')
)

const redirects: Record<string, string> = {}
let mapped = 0
let skipped = 0

for (const entry of manifest) {
  const oldUrl = entry.url
  const newUrl = mapOldUrl(oldUrl)
  if (newUrl && newUrl !== oldUrl) {
    redirects[oldUrl] = newUrl
    mapped++
  } else {
    skipped++
  }
}

const code = `// AUTO-GENERATED — do not edit manually. Run \`npm run gen:redirects\` to update.
import type { H3Event } from 'h3'
import { sendRedirect } from 'h3'

const REDIRECTS: Record<string, string> = ${JSON.stringify(redirects, null, 2)}

export default defineEventHandler((event: H3Event) => {
  const url = event.path ?? event.node.req.url ?? ''
  // Check both raw and decoded forms
  const decoded = decodeURIComponent(url).split('?')[0]
  const raw = url.split('?')[0]

  const target = REDIRECTS[decoded] ?? REDIRECTS[raw]
  if (target) {
    return sendRedirect(event, target, 301)
  }
})
`

const outPath = path.resolve(ROOT, 'server/middleware/redirects.ts')
fs.writeFileSync(outPath, code, 'utf-8')
console.log(`Generated ${outPath}`)
console.log(`  ${mapped} redirects mapped, ${skipped} skipped`)
