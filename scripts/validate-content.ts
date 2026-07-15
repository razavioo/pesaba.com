import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contentRoot = path.join(root, 'content')
const publicRoot = path.join(root, 'public')
const errors: string[] = []

const FORBIDDEN_PUBLIC_KEY = /(?:^|[_-])(?:smtp|mail[_-]?server|password|passwd|passphrase|pass|secret|token|api[_-]?key|private[_-]?key|client[_-]?secret|credentials?)(?:$|[_-])/i
const ASSET_EXTENSION = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i
const ASSET_REFERENCE = /(^|[\s'"(:])((?:\/(?!\/))[^'"\s)]+?\.(?:avif|gif|jpe?g|png|svg|webp|pdf))(?:[?#][^'"\s)]*)?/gim
const RAW_HTML = /<[A-Za-z!/][^>]*>/
const MARKDOWN_LINK = /!?\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g
const SAFE_LINK = /^(?:https?:|mailto:|tel:|\/|#|\.\.\/|\.\/)/i
const UNREVIEWED_PRODUCT_RISK = /guarante(?:e|ed)|immun(?:e|ity)|no attack|physically impossible|complete elimination|zero vulnerabilities|AFTA|Padafand|MASAF|\b(?:EAL|FIPS)\b/i

function filesIn(dir: string, include: (file: string) => boolean = () => true): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return filesIn(file, include)
    return entry.isFile() && include(file) ? [file] : []
  })
}

function metadata(file: string) {
  const source = fs.readFileSync(file, 'utf8')
  const block = source.match(/^---\n([\s\S]*?)\n---/m)?.[1] || ''
  const values = new Map<string, string>()
  for (const line of block.split('\n')) {
    const field = line.match(/^([\w-]+):\s*['"]?([^'"\n]+)['"]?$/)
    if (field) {
      if (values.has(field[1])) errors.push(`Duplicate frontmatter key '${field[1]}': ${file}`)
      values.set(field[1], field[2].trim())
    }
  }
  return { source, values }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function checkForbiddenKeys(value: unknown, file: string, trail: string[] = []): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkForbiddenKeys(item, file, [...trail, String(index)]))
    return
  }
  if (!isRecord(value)) return

  for (const [key, nested] of Object.entries(value)) {
    const keyTrail = [...trail, key]
    if (FORBIDDEN_PUBLIC_KEY.test(key)) {
      errors.push(`Forbidden non-public key ${keyTrail.join('.')}: ${path.relative(root, file)}`)
    }
    checkForbiddenKeys(nested, file, keyTrail)
  }
}

function validateJson(): void {
  for (const file of filesIn(contentRoot, file => file.endsWith('.json'))) {
    try {
      const value: unknown = JSON.parse(fs.readFileSync(file, 'utf8'))
      checkForbiddenKeys(value, file)
    }
    catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      errors.push(`Invalid JSON (${reason}): ${path.relative(root, file)}`)
    }
  }

}

function resolvePublicAsset(asset: string): string | null {
  let decoded = asset
  try {
    decoded = decodeURIComponent(asset)
  }
  catch {
    return null
  }
  const resolved = path.resolve(publicRoot, `.${decoded}`)
  if (resolved !== publicRoot && !resolved.startsWith(`${publicRoot}${path.sep}`)) return null
  return resolved
}

function validateMarkdown(): void {
  const missingAssets = new Set<string>()
  for (const collection of ['products', 'articles', 'glossary', 'industries', 'use-cases', 'company']) {
    const entries = new Map<string, Set<string>>()
    const collectionRoot = path.join(contentRoot, collection)

    for (const file of filesIn(collectionRoot, file => file.endsWith('.md'))) {
    const { source, values } = metadata(file)
    if (source.includes('ElasticSearch')) errors.push(`Use canonical Elasticsearch casing: ${file}`)
      const body = source.replace(/^---\n[\s\S]*?\n---\s*/m, '')
      const slug = values.get('slug') || path.basename(file).replace(/\.fa\.md$|\.md$/, '')
      const locale = file.endsWith('.fa.md') ? 'fa' : 'en'
      const key = `${collection}/${slug}`
      const locales = entries.get(key) || new Set<string>()

      if (locales.has(locale)) errors.push(`Duplicate ${locale} entry: ${path.relative(root, file)}`)
      locales.add(locale)
      entries.set(key, locales)

      if (!values.get('title')) errors.push(`Missing title: ${path.relative(root, file)}`)
      if (RAW_HTML.test(body)) {
        errors.push(`Raw HTML is not allowed in content: ${path.relative(root, file)}`)
      }
      if (/^\s*::/m.test(body) || /\{\{[\s\S]*?\}\}/.test(body)) {
        errors.push(`MDC syntax is not allowed in content: ${path.relative(root, file)}`)
      }
      for (const match of body.matchAll(MARKDOWN_LINK)) {
        const target = match[1]
        if (!SAFE_LINK.test(target)) {
          errors.push(`Unsafe or ambiguous link target ${target}: ${path.relative(root, file)}`)
        }
      }
      if (collection === 'products') {
        if (!values.get('category')) errors.push(`Missing product category: ${path.relative(root, file)}`)
        if (locale === 'fa' && !values.get('description')) {
          errors.push(`Missing Persian description: ${path.relative(root, file)}`)
        }
        if (values.get('evidence_reviewed') === 'true') {
          for (const field of ['evidence_id', 'evidence_reviewer', 'evidence_updated']) {
            if (!values.get(field)) {
              errors.push(`Reviewed product is missing ${field}: ${path.relative(root, file)}`)
            }
          }
        }
        else if (UNREVIEWED_PRODUCT_RISK.test(body)) {
          errors.push(`Unreviewed product body contains a high-risk claim: ${path.relative(root, file)}`)
        }
      }

      for (const match of source.matchAll(ASSET_REFERENCE)) {
        const asset = match[2]
        const resolved = resolvePublicAsset(asset)
        if (!resolved || !fs.existsSync(resolved)) {
          missingAssets.add(`Missing asset ${asset}: ${path.relative(root, file)}`)
        }
      }
    }

    for (const [key, locales] of entries) {
      if (locales.size !== 2) errors.push(`Missing locale pair (${[...locales].join(', ')}): ${key}`)
    }
  }
  errors.push(...missingAssets)
}

function formatMiB(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`
}

function checkAssetBudget(dir: string, maxBytes: number): void {
  for (const file of filesIn(dir, file => ASSET_EXTENSION.test(file))) {
    const size = fs.statSync(file).size
    if (size > maxBytes) {
      errors.push(`Asset ${path.relative(root, file)} is ${formatMiB(size)}; budget is ${formatMiB(maxBytes)}`)
    }
  }
}

validateJson()
validateMarkdown()
checkAssetBudget(path.join(publicRoot, 'images'), 2.5 * 1024 * 1024)
checkAssetBudget(path.join(publicRoot, 'photos'), 1.5 * 1024 * 1024)
checkAssetBudget(path.join(publicRoot, 'illustrations'), 1.5 * 1024 * 1024)
checkAssetBudget(path.join(publicRoot, 'schematics'), 1.5 * 1024 * 1024)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.warn('Content validation passed.')
