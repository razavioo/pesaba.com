import fs from 'node:fs'
import path from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'
import { REDIRECTS } from './server/redirects-map'

// Helper to get slugs from frontmatter
function getSlugsFromContent(dir: string): string[] {
  const fullPath = path.resolve(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) return []

  const getFiles = (dirPath: string): string[] => {
    let results: string[] = []
    const list = fs.readdirSync(dirPath)
    list.forEach((file) => {
      const filePath = path.join(dirPath, file)
      const stat = fs.statSync(filePath)
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(filePath))
      } else if (file.endsWith('.md')) {
        results.push(filePath)
      }
    })
    return results
  }

  const files = getFiles(fullPath)
  const slugs = new Set<string>()
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8')
      const match = content.match(/^slug:\s*['"]?([^'"\n]+)['"]?/m)
      if (match && match[1]) {
        slugs.add(match[1].trim())
      }
    } catch {
      // ignore
    }
  }
  return Array.from(slugs)
}

const articleSlugs = getSlugsFromContent('content/articles')
const productSlugs = getSlugsFromContent('content/products')
const glossarySlugs = getSlugsFromContent('content/glossary')
const industrySlugs = getSlugsFromContent('content/industries')
const useCaseSlugs = getSlugsFromContent('content/use-cases')
const productCategories = [
  'data-diodes',
  'network-encryption',
  'network-switching-filtering',
  'telecom-transmission',
  'cellular-monitoring',
  'bio-monitoring',
]

const isProduction = process.env.NODE_ENV !== 'development'
const nitroPreset = process.env.NITRO_PRESET || 'node-server'
const isStaticBuild = nitroPreset === 'github-pages' || process.env.NUXT_STATIC === 'true'
const publicSiteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://pesaba.com'
const appBaseURL = (() => {
  const pathname = String(process.env.NUXT_APP_BASE_URL || '/').trim().replace(/^\/+|\/+$/g, '')
  return pathname ? `/${pathname}/` : '/'
})()
const withAppBase = (pathname: string) => `${appBaseURL}${pathname.replace(/^\/+/, '')}`
const defaultSiteIndexable = (() => {
  try {
    const url = new URL(publicSiteUrl)
    return url.protocol === 'https:' && ['pesaba.com', 'www.pesaba.com'].includes(url.hostname)
  }
  catch {
    return false
  }
})()

const securityHeaders = {
  'content-security-policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "worker-src 'self' blob:",
    'upgrade-insecure-requests',
  ].join('; '),
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
}

const prerenderRoutes: string[] = []
const ogLocales = ['fa', 'en'] as const
const addOpenGraphRoutes = (type: string, slugs: string[]) => {
  for (const slug of slugs) {
    for (const locale of ogLocales) prerenderRoutes.push(`/og/${type}/${slug}.${locale}.png`)
  }
}

type RouteRule = { redirect: { to: string; statusCode: number } }

const redirectRules = Object.entries(REDIRECTS).reduce((acc, [from, to]) => {
  acc[from] = { redirect: { to, statusCode: 301 } }
  return acc
}, {} as Record<string, RouteRule>)

// Static previews need redirect HTML files; the production Node server handles these at runtime.
if (isStaticBuild) {
  prerenderRoutes.push('/feed.xml', '/sitemap.xml', '/robots.txt', '/en/solutions', '/fa/solutions')
  for (const locale of ogLocales) {
    for (const slug of industrySlugs) prerenderRoutes.push(`/${locale}/industries/${slug}`)
  }
  addOpenGraphRoutes('site', ['home'])
  addOpenGraphRoutes('article', articleSlugs)
  addOpenGraphRoutes('product', productSlugs)
  addOpenGraphRoutes('category', productCategories)
  addOpenGraphRoutes('glossary', glossarySlugs)
  addOpenGraphRoutes('industry', industrySlugs)
  addOpenGraphRoutes('use-case', useCaseSlugs)
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',

  devtools: { enabled: process.env.NUXT_DEVTOOLS === 'true' },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxt/eslint',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/typography.css',
    '~/assets/css/base.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // ─── i18n ────────────────────────────────────────────────────────────────
  i18n: {
    strategy: 'prefix',
    bundle: {
      optimizeTranslationDirective: false,
    },
    defaultLocale: 'fa',
    locales: [
      { code: 'fa', language: 'fa-IR', dir: 'rtl', name: 'فارسی', file: 'fa.json' },
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English', file: 'en.json' },
    ],
    langDir: 'locales/',
    detectBrowserLanguage: false,
  },

  // ─── Content ─────────────────────────────────────────────────────────────
  content: {
    markdown: {
      mdc: false,
    },
    highlight: {
      theme: 'github-dark',
      langs: ['bash', 'json', 'yaml', 'python', 'javascript', 'typescript'],
    },
    navigation: {
      fields: ['title', 'description', 'category', 'slug', 'locale'],
    },
  },

  // ─── Image ───────────────────────────────────────────────────────────────
  image: {
    quality: 80,
    formats: ['avif', 'webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1440,
    },
  },

  // ─── App head defaults ───────────────────────────────────────────────────
  app: {
    baseURL: appBaseURL,
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: withAppBase('favicon.svg') },
        { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: withAppBase('pesaba-mark-180.png') },
        { rel: 'manifest', href: withAppBase('manifest.webmanifest') },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Pesaba Blog', href: withAppBase('feed.xml') },

      ],
      meta: [
        { name: 'theme-color', content: '#FFFFFF' },
        { name: 'color-scheme', content: 'light' },
        { property: 'og:site_name', content: 'Pesaba' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  // ─── Runtime config ──────────────────────────────────────────────────────
  // Secrets intentionally have empty defaults. Set NUXT_* variables on the running
  // Node process so credentials are never captured in build output.
  runtimeConfig: {
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    smtpTo: '',
    smtpSalesTo: '',
    smtpSupportTo: '',
    smtpPartnershipTo: '',
    contactAllowedOrigins: '',
    contactTrustProxy: false,
    contactRateLimitMax: 5,
    contactMaxBodyBytes: 16_384,
    public: {
      cmsApiUrl: process.env.NUXT_PUBLIC_CMS_API_URL || 'http://localhost:4400/api/v1',
      siteUrl: publicSiteUrl,
      siteIndexable: process.env.NUXT_PUBLIC_SITE_INDEXABLE
        ? process.env.NUXT_PUBLIC_SITE_INDEXABLE === 'true'
        : defaultSiteIndexable,
      contactFormUrl: process.env.NUXT_PUBLIC_CONTACT_FORM_URL || '/api/contact',
      contactFormEnabled: process.env.NUXT_PUBLIC_CONTACT_FORM_ENABLED
        ? process.env.NUXT_PUBLIC_CONTACT_FORM_ENABLED === 'true'
        : !isStaticBuild,
    },
  },

  // ─── Nitro ───────────────────────────────────────────────────────────────
  nitro: {
    preset: nitroPreset,
    compressPublicAssets: true,
    sourceMap: !isProduction,
    timing: !isProduction,
    prerender: {
      routes: prerenderRoutes,
      crawlLinks: true,
      failOnError: true,
      ignore: ['/_ipx/**'],
    },
    routeRules: {
      ...(isProduction ? { '/**': { headers: securityHeaders } } : {}),
      '/api/**': {
        cors: false,
        headers: {
          ...(isProduction ? securityHeaders : {}),
          'cache-control': 'no-store, max-age=0',
        },
      },
      '/api/_content/**': {
        headers: {
          ...(isProduction ? securityHeaders : {}),
          'cache-control': 'no-store, max-age=0',
          'x-robots-tag': 'noindex, nofollow, noarchive',
        },
      },
      ...(isStaticBuild ? { '/': redirectRules['/'] } : redirectRules),
    },
  },

  // ─── TypeScript ──────────────────────────────────────────────────────────
  typescript: {
    strict: true,
    // Full vue-tsc checking remains a separate migration; keep production builds reliable.
    typeCheck: false,
  },

  // ─── Experimental ────────────────────────────────────────────────────────
  experimental: {
    viewTransition: true,
    payloadExtraction: true,
  },
})
