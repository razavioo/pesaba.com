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

const prerenderRoutes = ['/feed.xml', '/sitemap.xml', '/robots.txt']
articleSlugs.forEach(slug => prerenderRoutes.push(`/og/article/${slug}.svg`))
productSlugs.forEach(slug => prerenderRoutes.push(`/og/product/${slug}.svg`))
glossarySlugs.forEach(slug => prerenderRoutes.push(`/og/glossary/${slug}.svg`))

type RouteRule = { redirect: { to: string; statusCode: number } }

const redirectRules = Object.entries(REDIRECTS).reduce((acc, [from, to]) => {
  acc[from] = { redirect: { to, statusCode: 301 } }
  return acc
}, {} as Record<string, RouteRule>)

// Add all redirect source routes to prerender list so Nitro generates fallback redirect HTML files
Object.keys(REDIRECTS).forEach(route => prerenderRoutes.push(route))

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'pesaba_locale',
      redirectOn: 'root',
    },
  },

  // ─── Content ─────────────────────────────────────────────────────────────
  content: {
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
    baseURL: '/pesaba.com/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'Pesaba Blog', href: '/feed.xml' },

      ],
      meta: [
        { name: 'theme-color', content: '#FFFFFF' },
        { name: 'color-scheme', content: 'light dark' },
        { property: 'og:site_name', content: 'Pesaba' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  // ─── Runtime config ──────────────────────────────────────────────────────
  runtimeConfig: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpTo: process.env.SMTP_TO || 'admin@pesaba.com',
    contactEmail: process.env.CONTACT_EMAIL || 'admin@pesaba.com',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://razavioo.github.io/pesaba.com',
      contactFormUrl: process.env.NUXT_PUBLIC_CONTACT_FORM_URL || '/api/contact',
      meilisearchHost: process.env.NUXT_PUBLIC_MEILISEARCH_HOST || '',
      meilisearchKey: process.env.NUXT_PUBLIC_MEILISEARCH_KEY || '',
    },
  },

  // ─── Nitro ───────────────────────────────────────────────────────────────
  nitro: {
    preset: 'github-pages',
    prerender: {
      routes: prerenderRoutes,
      failOnError: false,
      ignore: ['/_ipx/**'],
    },
    routeRules: {
      '/api/**': { cors: false },
      ...redirectRules,
    },
  },

  // ─── TypeScript ──────────────────────────────────────────────────────────
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // ─── Experimental ────────────────────────────────────────────────────────
  experimental: {
    viewTransition: true,
    payloadExtraction: true,
  },
})
