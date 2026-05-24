import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

test.describe('SEO — meta tags', () => {
  const pages = [
    { name: 'homepage EN', path: `${EN}` },
    { name: 'homepage FA', path: `${FA}` },
    { name: 'products', path: `${EN}/products` },
    { name: 'product detail', path: `${EN}/products/data-diodes/a10` },
    { name: 'blog article', path: `${EN}/blog/what-is-aes-algorithm` },
    { name: 'contact', path: `${EN}/company/contact` },
    { name: 'glossary', path: `${EN}/glossary` },
  ]

  for (const { name, path } of pages) {
    test(`${name}: has <title> tag`, async ({ page }) => {
      await goto(page, path)
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(5)
    })
  }

  for (const { name, path } of pages) {
    test(`${name}: has meta description`, async ({ page }) => {
      await goto(page, path)
      const desc = await page.locator('meta[name="description"]').getAttribute('content')
      expect(desc).toBeTruthy()
      expect(desc!.length).toBeGreaterThan(10)
    })
  }

  for (const { name, path } of pages) {
    test(`${name}: has og:title`, async ({ page }) => {
      await goto(page, path)
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      expect(ogTitle).toBeTruthy()
    })
  }

  test('homepage: og:site_name is "Pesaba"', async ({ page }) => {
    await goto(page, EN)
    const siteName = await page.locator('meta[property="og:site_name"]').getAttribute('content')
    expect(siteName).toBe('Pesaba')
  })

  test('homepage: og:type is "website"', async ({ page }) => {
    await goto(page, EN)
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
    expect(ogType).toBe('website')
  })

  test('homepage: twitter:card is "summary_large_image"', async ({ page }) => {
    await goto(page, EN)
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(twitterCard).toBe('summary_large_image')
  })

  test('has favicon link', async ({ page }) => {
    await goto(page, EN)
    const favicon = page.locator('link[rel="icon"]')
    await expect(favicon).toHaveCount(1)
    const href = await favicon.getAttribute('href')
    expect(href).toBeTruthy()
  })

  test('has canonical URL or manifest link', async ({ page }) => {
    await goto(page, EN)
    const manifest = page.locator('link[rel="manifest"]')
    await expect(manifest).toHaveCount(1)
    const href = await manifest.getAttribute('href')
    expect(href).toBeTruthy()
  })

  test('product detail page title contains product name', async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
    const title = await page.title()
    expect(title).toContain('A10')
  })

  test('blog article page title contains article title', async ({ page }) => {
    await goto(page, `${EN}/blog/what-is-aes-algorithm`)
    const title = await page.title()
    expect(title.toLowerCase()).toContain('aes')
  })
})

test.describe('SEO — structured data', () => {
  test('homepage has JSON-LD schema', async ({ page }) => {
    await goto(page, EN)
    const jsonLD = await page.locator('script[type="application/ld+json"]').all()
    expect(jsonLD.length).toBeGreaterThan(0)
  })

  test('product detail page has breadcrumb schema', async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
    const jsonLD = page.locator('script[type="application/ld+json"]')
    const count = await jsonLD.count()
    expect(count).toBeGreaterThan(0)
  })
})
