/**
 * Capture full-page screenshots of every route across {locale} × {viewport} × {theme}.
 *
 * Usage:
 *   nvm use 22 && cd v2
 *   BASE_URL=http://localhost:3001 npx tsx scripts/take-screenshots.ts
 *
 * Filters (all optional, comma-separated):
 *   --locales=en,fa
 *   --viewports=desktop,mobile
 *   --themes=dark,light
 *   --only=homepage,blog/*           glob-ish filter on route name
 *   --out=screenshots                output directory (relative to v2/)
 *   --concurrency=4
 *   --skip-dynamic                   only static pages
 *   --dry-run                        list routes without capturing
 */
import { chromium, devices, type Browser, type BrowserContext } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const CONTENT = path.join(ROOT, 'content')

type Locale = 'en' | 'fa'
type Viewport = 'desktop' | 'mobile'
type Theme = 'light'

interface Args {
  locales: Locale[]
  viewports: Viewport[]
  themes: Theme[]
  only: string | null
  out: string
  baseUrl: string
  concurrency: number
  skipDynamic: boolean
  dryRun: boolean
}

function parseArgs(): Args {
  const argv = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=')
      return [k, v ?? 'true']
    }),
  ) as Record<string, string>
  const list = <T extends string>(v: string | undefined, fallback: T[]): T[] =>
    v ? (v.split(',').filter(Boolean) as T[]) : fallback
  return {
    locales: list<Locale>(argv.locales, ['en', 'fa']),
    viewports: list<Viewport>(argv.viewports, ['desktop', 'mobile']),
    themes: list<Theme>(argv.themes, ['light']),
    only: argv.only ?? null,
    out: argv.out ?? 'screenshots',
    baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    concurrency: argv.concurrency ? Number(argv.concurrency) : 4,
    skipDynamic: argv['skip-dynamic'] === 'true',
    dryRun: argv['dry-run'] === 'true',
  }
}

/** strip frontmatter slug for product files, fall back to filename. */
function readSlug(file: string): string {
  const base = path.basename(file).replace(/\.(fa\.)?md$/, '')
  try {
    const src = fs.readFileSync(file, 'utf8')
    const m = src.match(/^---[\s\S]*?\nslug:\s*['"]?([^'"\n]+)['"]?/m)
    if (m) return m[1].trim()
  } catch {
    // Fall back to the filename when a content file cannot be read.
  }
  return base
}

/** Return language-neutral set of slugs (drop `.fa.md` duplicates). */
function listSlugs(dir: string, withFrontmatterSlug = false): string[] {
  if (!fs.existsSync(dir)) return []
  const seen = new Set<string>()
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (!fs.statSync(full).isFile()) continue
    if (!entry.endsWith('.md')) continue
    if (entry.endsWith('.fa.md')) continue
    seen.add(withFrontmatterSlug ? readSlug(full) : entry.replace(/\.md$/, ''))
  }
  return [...seen].sort()
}

function enumerateRoutes(skipDynamic: boolean): { name: string; path: string }[] {
  const routes: { name: string; path: string }[] = []
  const add = (name: string, p: string) => routes.push({ name, path: p })

  // Static pages (mirrors pages/ tree)
  add('homepage', '/')
  add('search', '/search')
  add('solutions', '/solutions')
  add('technology', '/technology')
  add('font-demo', '/font-demo')
  add('products', '/products')
  add('products-compare', '/products/compare')
  add('blog', '/blog')
  add('industries', '/industries')
  add('resources', '/resources')
  add('resources-firmware', '/resources/firmware')
  add('trust', '/trust')
  add('trust-compliance-matrix', '/trust/compliance-matrix')
  add('glossary', '/glossary')
  add('company-about', '/company/about')
  add('company-contact', '/company/contact')
  add('company-press', '/company/press')
  add('company-careers', '/company/careers')

  if (skipDynamic) return routes

  // Product categories + items
  const productsRoot = path.join(CONTENT, 'products')
  if (fs.existsSync(productsRoot)) {
    for (const cat of fs.readdirSync(productsRoot)) {
      const catDir = path.join(productsRoot, cat)
      if (!fs.statSync(catDir).isDirectory()) continue
      add(`products-${cat}`, `/products/${cat}`)
      for (const entry of fs.readdirSync(catDir)) {
        if (!entry.endsWith('.md') || entry.endsWith('.fa.md')) continue
        const slug = readSlug(path.join(catDir, entry))
        add(`product-${cat}-${slug}`, `/products/${cat}/${slug}`)
      }
    }
  }

  // Blog articles
  for (const s of listSlugs(path.join(CONTENT, 'articles'))) add(`blog-${s}`, `/blog/${s}`)
  // Industries
  for (const s of listSlugs(path.join(CONTENT, 'industries'))) add(`industry-${s}`, `/industries/${s}`)
  // Use cases
  for (const s of listSlugs(path.join(CONTENT, 'use-cases'))) add(`use-case-${s}`, `/use-cases/${s}`)
  // Glossary terms
  for (const s of listSlugs(path.join(CONTENT, 'glossary'))) add(`glossary-${s}`, `/glossary/${s}`)

  return routes
}

const VIEWPORTS: Record<Viewport, { width: number; height: number; isMobile: boolean; ua?: string }> = {
  desktop: { width: 1440, height: 900, isMobile: false },
  mobile: {
    ...devices['iPhone 14'].viewport!,
    isMobile: true,
    ua: devices['iPhone 14'].userAgent,
  } as any,
}

interface Job {
  locale: Locale
  viewport: Viewport
  theme: Theme
  route: { name: string; path: string }
  outFile: string
}

async function capture(browser: Browser, args: Args, job: Job): Promise<{ ok: boolean; err?: string }> {
  const vp = VIEWPORTS[job.viewport]
  let context: BrowserContext | null = null
  try {
    context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      deviceScaleFactor: vp.isMobile ? 3 : 2,
      userAgent: vp.ua,
      locale: job.locale === 'fa' ? 'fa-IR' : 'en-US',
      colorScheme: job.theme,
    })
    await context.addCookies([
      { name: 'pesaba_theme', value: job.theme, domain: new URL(args.baseUrl).hostname, path: '/' },
      { name: 'i18n_redirected', value: job.locale, domain: new URL(args.baseUrl).hostname, path: '/' },
    ])
    const page = await context.newPage()
    const url = `${args.baseUrl}/${job.locale}${job.route.path}`.replace(/\/$/, '') || args.baseUrl
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 })
    if (!resp || !resp.ok()) {
      return { ok: false, err: `HTTP ${resp?.status() ?? 'no response'} for ${url}` }
    }
    // Let lazy images, fonts, hero animations settle
    await page.waitForTimeout(900)
    fs.mkdirSync(path.dirname(job.outFile), { recursive: true })
    await page.screenshot({ path: job.outFile, fullPage: true, animations: 'disabled' })
    return { ok: true }
  } catch (err: any) {
    return { ok: false, err: err?.message ?? String(err) }
  } finally {
    await context?.close().catch(() => {})
  }
}

async function runPool<T>(items: T[], concurrency: number, fn: (item: T, i: number) => Promise<void>) {
  let idx = 0
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const i = idx++
      if (i >= items.length) return
      await fn(items[i], i)
    }
  })
  await Promise.all(workers)
}

function matchesOnly(name: string, only: string | null): boolean {
  if (!only) return true
  const patterns = only.split(',').map((p) => p.trim()).filter(Boolean)
  return patterns.some((p) => {
    const re = new RegExp('^' + p.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$')
    return re.test(name)
  })
}

async function main() {
  const args = parseArgs()
  const outRoot = path.resolve(ROOT, args.out)
  const routes = enumerateRoutes(args.skipDynamic).filter((r) => matchesOnly(r.name, args.only))

  const jobs: Job[] = []
  for (const locale of args.locales) {
    for (const viewport of args.viewports) {
      for (const theme of args.themes) {
        for (const route of routes) {
          const outFile = path.join(outRoot, locale, `${viewport}-${theme}`, `${route.name}.png`)
          jobs.push({ locale, viewport, theme, route, outFile })
        }
      }
    }
  }

  console.log(`Routes: ${routes.length}`)
  console.log(`Total screenshots: ${jobs.length}`)
  console.log(`Base URL: ${args.baseUrl}`)
  console.log(`Output: ${outRoot}`)
  if (args.dryRun) {
    for (const j of jobs.slice(0, 50)) console.log(`  ${j.locale} ${j.viewport}-${j.theme}  ${j.route.path}`)
    if (jobs.length > 50) console.log(`  ... (+${jobs.length - 50} more)`)
    return
  }

  fs.mkdirSync(outRoot, { recursive: true })
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox']
  })
  const failures: { job: Job; err: string }[] = []
  const t0 = Date.now()

  await runPool(jobs, args.concurrency, async (job, i) => {
    const tag = `[${String(i + 1).padStart(jobs.length.toString().length, '0')}/${jobs.length}]`
    const res = await capture(browser, args, job)
    if (res.ok) {
      console.log(`${tag} ok  ${path.relative(ROOT, job.outFile)}`)
    } else {
      failures.push({ job, err: res.err ?? 'unknown' })
      console.log(`${tag} FAIL ${path.relative(ROOT, job.outFile)} — ${res.err}`)
    }
  })

  await browser.close()

  // Write manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: args.baseUrl,
    counts: { jobs: jobs.length, ok: jobs.length - failures.length, failed: failures.length },
    failures: failures.map((f) => ({ route: f.job.route.path, file: f.job.outFile, error: f.err })),
  }
  fs.writeFileSync(path.join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2))

  console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(1)}s.  ok=${manifest.counts.ok}  failed=${manifest.counts.failed}`)
  if (failures.length) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
