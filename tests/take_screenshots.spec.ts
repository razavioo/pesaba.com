import { test } from '@playwright/test'
import * as fs from 'fs'

const BASE = 'http://localhost:3001'
const OUT = '/tmp/ui_screenshots'
fs.mkdirSync(OUT, { recursive: true })

const pages = [
  { name: 'homepage', url: '/en' },
  { name: 'homepage-fa', url: '/fa' },
  { name: 'products', url: '/en/products' },
  { name: 'product-detail', url: '/en/products/data-diodes/g200' },
  { name: 'blog', url: '/en/blog' },
  { name: 'blog-article', url: '/en/blog/what-is-aes-algorithm' },
  { name: 'technology', url: '/en/technology' },
  { name: 'trust', url: '/en/trust' },
  { name: 'contact', url: '/en/company/contact' },
  { name: 'about', url: '/en/company/about' },
  { name: 'glossary', url: '/en/glossary' },
]

for (const pg of pages) {
  test(`screenshot-dark-${pg.name}`, async ({ page }) => {
    await page.context().addCookies([{ name: 'pesaba_theme', value: 'dark', domain: 'localhost', path: '/' }])
    await page.goto(BASE + pg.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/${pg.name}-dark.png`, fullPage: true })
  })
  test(`screenshot-light-${pg.name}`, async ({ page }) => {
    await page.context().addCookies([{ name: 'pesaba_theme', value: 'light', domain: 'localhost', path: '/' }])
    await page.goto(BASE + pg.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${OUT}/${pg.name}-light.png`, fullPage: true })
  })
}
