import fs from 'node:fs'
import path from 'node:path'

interface Finding {
  category: string
  message: string
}

interface LeakRule {
  name: string
  pattern: RegExp
}

interface SitemapEntry {
  index: number
  raw: string
  url: URL
  file: string | null
}

interface AssetReference {
  raw: string
  sourceFile: string
}

const projectRoot = process.cwd()
const publicRoot = path.resolve(
  projectRoot,
  process.env.OUTPUT_PUBLIC_DIR || path.join('.output', 'public'),
)
const configuredSiteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://pesaba.com'
const findings: Finding[] = []
const maxTextFileBytes = 10 * 1024 * 1024
const textExtension = /\.(?:cjs|css|html?|js|json|map|mjs|svg|txt|webmanifest|xml)$/i

const leakRules: LeakRule[] = [
  {
    name: 'private-key marker',
    pattern: /-----BEGIN (?:DSA |EC |OPENSSH |RSA )?PRIVATE KEY-----/g,
  },
  {
    name: 'credential-bearing URL',
    pattern: /\b(?:ftp|https?|postgres(?:ql)?|redis|smtp):\/\/[^\s/:@]+:[^\s/@]+@/gi,
  },
  {
    name: 'bearer token',
    pattern: /\bBearer\s+[A-Za-z0-9._~+/-]{20,}={0,2}\b/g,
  },
  {
    name: 'GitHub token',
    pattern: /\bgh[oprsu]_[A-Za-z0-9]{30,}\b/g,
  },
  {
    name: 'AWS access key',
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g,
  },
  {
    name: 'JWT',
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    name: 'server-only mail configuration key',
    pattern: /["'`]?\b(?:(?:contact[_-])?mail[_-]?server[_-]?(?:host|port|pass(?:word)?|receiver|user(?:name)?)|smtp(?:Host|Port|Secure|User|Pass|From|To|SalesTo|SupportTo|PartnershipTo)|smtp[_-]?(?:host|port|secure|user(?:name)?|pass(?:word)?|from|to))\b["'`]?\s*[:=]/gi,
  },
  {
    name: 'server-only contact configuration key',
    pattern: /["'`]?\bcontact(?:AllowedOrigins|TrustProxy|RateLimitMax|MaxBodyBytes)\b["'`]?\s*[:=]/g,
  },
  {
    name: 'server-only environment variable',
    pattern: /\b(?:NUXT_)?(?:SMTP_(?:HOST|PORT|SECURE|USER(?:NAME)?|PASS(?:WORD)?|FROM|TO|SALES_TO|SUPPORT_TO|PARTNERSHIP_TO)|CONTACT_(?:ALLOWED_ORIGINS|TRUST_PROXY|RATE_LIMIT_MAX|MAX_BODY_BYTES))\b/g,
  },
  {
    name: 'static high-risk credential assignment',
    pattern: /["'`]?(?:api[_-]?key|client[_-]?secret|private[_-]?key|access[_-]?token|auth[_-]?token|smtp[_-]?(?:pass(?:word)?|user(?:name)?)|mail[_-]?server[_-]?(?:pass(?:word)?|user(?:name)?))["'`]?\s*[:=]\s*["'`][^"'`\r\n]{4,}["'`]/gi,
  },
]

function addFinding(category: string, message: string): void {
  findings.push({ category, message })
}

function filesIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return filesIn(file)
    return entry.isFile() ? [file] : []
  })
}

function relativeFile(file: string): string {
  return path.relative(projectRoot, file).split(path.sep).join('/')
}

function outputRelativeFile(file: string): string {
  return path.relative(publicRoot, file).split(path.sep).join('/')
}

function isBinary(buffer: Buffer): boolean {
  return buffer.subarray(0, 8192).includes(0)
}

function lineNumber(source: string, index: number): number {
  let line = 1
  for (let cursor = 0; cursor < index; cursor++) {
    if (source.charCodeAt(cursor) === 10) line++
  }
  return line
}

function normalizeBasePath(value: string): string {
  let pathname = value.trim() || '/'
  try {
    if (/^https?:\/\//i.test(pathname)) pathname = new URL(pathname).pathname
  }
  catch {
    // The malformed value is reported when URLs are resolved below.
  }
  pathname = `/${pathname.replace(/^\/+|\/+$/g, '')}`
  return pathname === '/' ? '/' : pathname
}

function siteUrl(): URL {
  try {
    return new URL(configuredSiteUrl)
  }
  catch {
    addFinding('configuration', 'NUXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL.')
    return new URL('https://pesaba.com')
  }
}

const site = siteUrl()
const basePath = normalizeBasePath(
  process.env.NUXT_APP_BASE_URL || (site.pathname !== '/' ? site.pathname : '/'),
)

function decodeXml(value: string): string {
  return value
    .replace(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/, '$1')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .trim()
}

function decodedPathname(pathname: string): string | null {
  try {
    return decodeURIComponent(pathname)
  }
  catch {
    return null
  }
}

function stripBasePath(pathname: string): string | null {
  if (basePath === '/') return pathname || '/'
  if (pathname === basePath || pathname === `${basePath}/`) return '/'
  if (!pathname.startsWith(`${basePath}/`)) return null
  return pathname.slice(basePath.length) || '/'
}

function artifactFileForPathname(pathname: string): string | null {
  const withoutBase = stripBasePath(pathname)
  if (withoutBase === null) return null
  const decoded = decodedPathname(withoutBase)
  if (decoded === null || decoded.includes('\0')) return null

  const relativePath = decoded.replace(/^\/+/, '')
  const candidates = relativePath
    ? path.posix.extname(relativePath)
      ? [relativePath, path.posix.join(relativePath, 'index.html')]
      : [path.posix.join(relativePath, 'index.html'), `${relativePath}.html`, relativePath]
    : ['index.html']

  for (const candidate of candidates) {
    const file = path.resolve(publicRoot, candidate)
    if (file !== publicRoot && !file.startsWith(`${publicRoot}${path.sep}`)) continue
    try {
      if (fs.statSync(file).isFile()) return file
    }
    catch {
      // Try the next static-route representation.
    }
  }
  return null
}

function normalizedHttpUrl(value: string): string | null {
  try {
    const url = new URL(value, site)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    url.hash = ''
    url.pathname = url.pathname.replace(/%[0-9a-f]{2}/gi, match => match.toUpperCase())
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '')
    return url.href
  }
  catch {
    return null
  }
}

function scanForCredentialLeaks(files: string[]): void {
  for (const file of files) {
    if (!textExtension.test(file)) continue
    let stat: fs.Stats
    try {
      stat = fs.statSync(file)
    }
    catch {
      continue
    }
    if (stat.size > maxTextFileBytes) continue

    const buffer = fs.readFileSync(file)
    if (isBinary(buffer)) continue
    const source = buffer.toString('utf8')

    for (const rule of leakRules) {
      rule.pattern.lastIndex = 0
      for (const match of source.matchAll(rule.pattern)) {
        addFinding(
          'credential exposure',
          `${relativeFile(file)}:${lineNumber(source, match.index)} (${rule.name}; matched value omitted)`,
        )
      }
    }
  }
}

function sitemapEntries(): SitemapEntry[] {
  const sitemapFile = path.join(publicRoot, 'sitemap.xml')
  if (!fs.existsSync(sitemapFile)) {
    addFinding('sitemap', `${relativeFile(sitemapFile)} is missing.`)
    return []
  }

  const source = fs.readFileSync(sitemapFile, 'utf8')
  const rawLocations = [...source.matchAll(/<(?:[\w-]+:)?loc\b[^>]*>([\s\S]*?)<\/(?:[\w-]+:)?loc>/gi)]
    .map(match => decodeXml(match[1]))

  if (!rawLocations.length) {
    addFinding('sitemap', 'sitemap.xml contains no <loc> entries.')
    return []
  }

  const entries: SitemapEntry[] = []
  const seen = new Map<string, number>()

  rawLocations.forEach((raw, offset) => {
    const index = offset + 1
    if (/%25[0-9a-f]{2}/i.test(raw)) {
      addFinding('sitemap', `<loc> #${index} appears to be double-encoded.`)
    }

    let url: URL
    try {
      url = new URL(raw)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('unsupported protocol')
    }
    catch {
      addFinding('sitemap', `<loc> #${index} is not a valid absolute HTTP(S) URL.`)
      return
    }

    const normalized = normalizedHttpUrl(raw)
    if (normalized) {
      const previous = seen.get(normalized)
      if (previous) addFinding('sitemap', `<loc> #${index} duplicates <loc> #${previous}.`)
      else seen.set(normalized, index)
    }

    const decoded = decodedPathname(url.pathname)
    if (decoded === null) {
      addFinding('sitemap', `<loc> #${index} has malformed percent encoding.`)
    }

    const withoutBase = stripBasePath(url.pathname)
    if (withoutBase === null) {
      addFinding('sitemap', `<loc> #${index} is outside deployment base ${basePath}/.`)
    }

    const file = artifactFileForPathname(url.pathname)
    if (!file) {
      const safePath = decoded || url.pathname
      addFinding('sitemap route', `<loc> #${index} has no static output for ${safePath}.`)
    }
    entries.push({ index, raw, url, file })
  })

  return entries
}

function attributes(tag: string): Map<string, string> {
  const result = new Map<string, string>()
  const pattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g
  for (const match of tag.matchAll(pattern)) {
    const name = match[1].toLowerCase()
    if (name.startsWith('<')) continue
    result.set(name, decodeXml(match[2] ?? match[3] ?? match[4] ?? ''))
  }
  return result
}

function canonicalUrls(source: string): string[] {
  const canonicals: string[] = []
  for (const match of source.matchAll(/<link\b[^>]*>/gi)) {
    const attrs = attributes(match[0])
    const rel = (attrs.get('rel') || '').toLowerCase().split(/\s+/)
    if (rel.includes('canonical')) canonicals.push(attrs.get('href') || '')
  }
  return canonicals
}

function validateCanonicals(files: string[], entries: SitemapEntry[]): void {
  const canonicalByFile = new Map<string, string[]>()

  for (const file of files.filter(file => /\.html?$/i.test(file))) {
    const canonicals = canonicalUrls(fs.readFileSync(file, 'utf8'))
    canonicalByFile.set(file, canonicals)
    if (canonicals.length > 1) {
      addFinding('canonical', `${relativeFile(file)} contains ${canonicals.length} canonical links.`)
    }
    canonicals.forEach((canonical, index) => {
      if (!canonical || /(?:^|[/:?&=])(undefined|null)(?:$|[/?#&])/i.test(canonical)) {
        addFinding('canonical', `${relativeFile(file)} has an empty or undefined canonical #${index + 1}.`)
      }
      else if (!normalizedHttpUrl(canonical) || !/^https?:\/\//i.test(canonical)) {
        addFinding('canonical', `${relativeFile(file)} canonical #${index + 1} is not an absolute HTTP(S) URL.`)
      }
    })
  }

  const canonicalOwners = new Map<string, SitemapEntry>()
  for (const entry of entries) {
    if (!entry.file || !/\.html?$/i.test(entry.file)) continue
    const canonicals = canonicalByFile.get(entry.file) || []
    if (canonicals.length === 0) {
      addFinding('canonical', `${relativeFile(entry.file)} is in the sitemap but has no canonical link.`)
      continue
    }
    if (canonicals.length !== 1) continue

    const canonical = normalizedHttpUrl(canonicals[0])
    const location = normalizedHttpUrl(entry.raw)
    if (!canonical || !location) continue
    if (canonical !== location) {
      addFinding('canonical', `${relativeFile(entry.file)} canonical does not match sitemap <loc> #${entry.index}.`)
    }

    const owner = canonicalOwners.get(canonical)
    if (owner && owner.file !== entry.file) {
      addFinding(
        'canonical',
        `Sitemap routes #${owner.index} and #${entry.index} share the same canonical URL.`,
      )
    }
    else {
      canonicalOwners.set(canonical, entry)
    }
  }
}

function assetReferencesFromHtml(file: string, source: string): AssetReference[] {
  const references: AssetReference[] = []
  const add = (raw: string | undefined) => {
    if (raw) references.push({ raw, sourceFile: file })
  }
  const addSrcset = (raw: string | undefined) => {
    if (!raw) return
    if (raw.trim().startsWith('data:')) return
    for (const candidate of raw.split(',')) add(candidate.trim().split(/\s+/)[0])
  }

  for (const match of source.matchAll(/<(?:script|img|source|video|audio|track|link|meta|object)\b[^>]*>/gi)) {
    const tag = match[0]
    const tagName = tag.match(/^<([\w-]+)/)?.[1].toLowerCase()
    const attrs = attributes(tag)

    if (tagName === 'script') add(attrs.get('src'))
    if (tagName === 'img' || tagName === 'source') {
      add(attrs.get('src'))
      addSrcset(attrs.get('srcset'))
    }
    if (tagName === 'video') {
      add(attrs.get('src'))
      add(attrs.get('poster'))
    }
    if (tagName === 'audio' || tagName === 'track') add(attrs.get('src'))
    if (tagName === 'object') add(attrs.get('data'))
    if (tagName === 'link') {
      const rel = (attrs.get('rel') || '').toLowerCase().split(/\s+/)
      const assetRels = ['apple-touch-icon', 'icon', 'manifest', 'modulepreload', 'prefetch', 'preload', 'stylesheet']
      if (rel.some(value => assetRels.includes(value))) add(attrs.get('href'))
      const alternateType = (attrs.get('type') || '').toLowerCase()
      if (rel.includes('alternate') && !attrs.has('hreflang') && /(?:atom|rss|xml)/.test(alternateType)) {
        add(attrs.get('href'))
      }
    }
    if (tagName === 'meta') {
      const key = (attrs.get('property') || attrs.get('name') || '').toLowerCase()
      if (/^(?:og:image(?::url)?|twitter:image(?::src)?)$/.test(key)) add(attrs.get('content'))
    }
  }

  for (const match of source.matchAll(/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]+))\s*\)/gi)) {
    add(match[1] ?? match[2] ?? match[3])
  }
  return references
}

function assetReferencesFromCss(file: string, source: string): AssetReference[] {
  const references: AssetReference[] = []
  for (const match of source.matchAll(/\burl\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"\s]+))\s*\)/gi)) {
    const raw = match[1] ?? match[2] ?? match[3]
    if (raw) references.push({ raw, sourceFile: file })
  }
  return references
}

function manifestAssetReferences(file: string): AssetReference[] {
  let value: unknown
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'))
  }
  catch {
    addFinding('asset', `${relativeFile(file)} is not valid JSON.`)
    return []
  }

  const references: AssetReference[] = []
  const visit = (nested: unknown): void => {
    if (Array.isArray(nested)) {
      nested.forEach(visit)
      return
    }
    if (!nested || typeof nested !== 'object') return
    for (const [key, child] of Object.entries(nested)) {
      if (key === 'src' && typeof child === 'string') references.push({ raw: child, sourceFile: file })
      else visit(child)
    }
  }
  visit(value)
  return references
}

function sourceUrlPath(file: string): string {
  const relative = outputRelativeFile(file)
  const route = /\/index\.html?$/i.test(`/${relative}`)
    ? `/${path.posix.dirname(relative).replace(/^\.$/, '')}/`
    : `/${relative}`
  const normalizedRoute = route.replace(/\/{2,}/g, '/')
  return basePath === '/'
    ? normalizedRoute
    : `${basePath}${normalizedRoute === '/' ? '/' : normalizedRoute}`
}

function resolveInternalAsset(reference: AssetReference): { file?: string, issue?: string } | null {
  const raw = decodeXml(reference.raw.trim()).replace(/^['"]|['"]$/g, '').trim()
  if (!raw || raw.startsWith('#') || /^(?:data|blob|mailto|tel|javascript):/i.test(raw)) return null
  if (/[{][{]|[}][}]|\b(?:undefined|null)\b/i.test(raw)) {
    return { issue: 'contains an unresolved value' }
  }

  const sourceUrl = new URL(sourceUrlPath(reference.sourceFile), 'https://artifact.invalid')
  let resolved: URL
  try {
    resolved = new URL(raw, sourceUrl)
  }
  catch {
    return { issue: 'is not a valid URL' }
  }

  if (resolved.origin !== 'https://artifact.invalid') {
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null
    if (resolved.origin !== site.origin) return null
  }

  const withoutBase = stripBasePath(resolved.pathname)
  if (withoutBase === null) {
    return { issue: `does not include deployment base ${basePath}/` }
  }
  // Nitro serves these client payloads and image transformations dynamically;
  // they are not standalone files in a static artifact.
  if (/^\/(?:_ipx|api\/|.*\/_payload\.json)/.test(withoutBase)) return null
  const decoded = decodedPathname(withoutBase)
  if (decoded === null || decoded.includes('\0')) return { issue: 'has malformed percent encoding' }

  const file = path.resolve(publicRoot, decoded.replace(/^\/+/, ''))
  if (file !== publicRoot && !file.startsWith(`${publicRoot}${path.sep}`)) {
    return { issue: 'resolves outside the public artifact' }
  }
  return { file }
}

function validateAssets(files: string[]): void {
  const references: AssetReference[] = []
  for (const file of files) {
    if (/\.html?$/i.test(file)) {
      references.push(...assetReferencesFromHtml(file, fs.readFileSync(file, 'utf8')))
    }
    else if (/\.css$/i.test(file)) {
      references.push(...assetReferencesFromCss(file, fs.readFileSync(file, 'utf8')))
    }
    else if (/\.webmanifest$/i.test(file)) {
      references.push(...manifestAssetReferences(file))
    }
  }

  const reported = new Set<string>()
  for (const reference of references) {
    const resolved = resolveInternalAsset(reference)
    if (!resolved) continue

    let issue = resolved.issue
    if (resolved.file && !fs.existsSync(resolved.file)) issue = 'points to a missing public asset'
    else if (resolved.file) {
      try {
        if (!fs.statSync(resolved.file).isFile()) issue = 'does not point to a public file'
      }
      catch {
        issue = 'points to a missing public asset'
      }
    }
    if (!issue) continue

    const key = `${reference.sourceFile}\0${reference.raw}\0${issue}`
    if (reported.has(key)) continue
    reported.add(key)

    let target = 'internal reference'
    try {
      const parsed = new URL(reference.raw, new URL(sourceUrlPath(reference.sourceFile), 'https://artifact.invalid'))
      target = parsed.pathname
    }
    catch {
      // Do not echo malformed or potentially credential-bearing raw values.
    }
    addFinding('asset', `${relativeFile(reference.sourceFile)}: ${target} ${issue}.`)
  }
}

function report(): never | void {
  if (!findings.length) return

  const categories = new Map<string, Finding[]>()
  for (const finding of findings) {
    const group = categories.get(finding.category) || []
    group.push(finding)
    categories.set(finding.category, group)
  }

  console.error(`Output validation failed with ${findings.length} issue(s):`)
  for (const [category, group] of categories) {
    console.error(`\n${category} (${group.length})`)
    const visible = group.slice(0, 50)
    visible.forEach(finding => console.error(`- ${finding.message}`))
    if (group.length > visible.length) {
      console.error(`- ${group.length - visible.length} additional issue(s) omitted.`)
    }
  }
  process.exit(1)
}

if (!fs.existsSync(publicRoot) || !fs.statSync(publicRoot).isDirectory()) {
  console.error(`Output directory is missing: ${relativeFile(publicRoot)}. Run npm run generate first.`)
  process.exit(1)
}

const outputFiles = filesIn(publicRoot)
if (!outputFiles.length) {
  console.error(`Output directory is empty: ${relativeFile(publicRoot)}. Run npm run generate first.`)
  process.exit(1)
}

scanForCredentialLeaks(outputFiles)
const entries = sitemapEntries()
validateCanonicals(outputFiles, entries)
validateAssets(outputFiles)
report()

console.warn(
  `Output validation passed (${outputFiles.length} files, ${entries.length} sitemap locations, base ${basePath}/).`,
)
