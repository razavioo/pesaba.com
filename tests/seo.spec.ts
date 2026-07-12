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
    expect(href).toContain('/favicon.svg')
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /pesaba-mark-180\.png/)
  })

  test('localized article has one canonical and reciprocal hreflang links', async ({ page }) => {
    const slug = 'what-is-aes-algorithm'
    await goto(page, `${EN}/blog/${slug}`)

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    await expect(canonical).toHaveAttribute('href', `https://pesaba.com/en/blog/${slug}`)

    const alternates = page.locator('link[rel="alternate"][hreflang]')
    await expect(alternates).toHaveCount(3)
    await expect(page.locator('link[rel="alternate"][hreflang="en-US"]')).toHaveAttribute('href', `https://pesaba.com/en/blog/${slug}`)
    await expect(page.locator('link[rel="alternate"][hreflang="fa-IR"]')).toHaveAttribute('href', `https://pesaba.com/fa/blog/${slug}`)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `https://pesaba.com/fa/blog/${slug}`)
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

  test('organization schema uses the full logo asset', async ({ page }) => {
    await goto(page, EN)
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    const organization = schemas.map(schema => JSON.parse(schema)).find(schema => schema['@type'] === 'Organization')
    expect(organization.logo.url).toBe('https://pesaba.com/logo.svg')
  })

  test('product detail page has breadcrumb schema', async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    const parsed = schemas.map(schema => JSON.parse(schema))
    expect(parsed.some(schema => schema['@type'] === 'BreadcrumbList')).toBe(true)
    expect(parsed.some(schema => schema['@type'] === 'Product')).toBe(true)
  })

  test('glossary detail has valid DefinedTerm schema', async ({ page }) => {
    await goto(page, `${EN}/glossary/aes`)
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    const term = schemas.map(schema => JSON.parse(schema)).find(schema => schema['@type'] === 'DefinedTerm')
    expect(term).toBeTruthy()
    expect(term.url).toBe('https://pesaba.com/en/glossary/aes')
    expect(term.inDefinedTermSet?.url).toBe('https://pesaba.com/en/glossary')
  })
})

test.describe('SEO — crawlability and generated assets', () => {
  test('sitemap is unique, canonical, localized, and excludes noindex routes', async ({ request }) => {
    const response = await request.get('sitemap.xml')
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/xml')

    const xml = await response.text()
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])

    expect(locations.length).toBeGreaterThan(200)
    expect(new Set(locations).size).toBe(locations.length)
    expect(locations.every(location => location.startsWith('https://pesaba.com/'))).toBe(true)
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    expect(xml).toContain('hreflang="fa-IR"')
    expect(xml).toContain('hreflang="en-US"')
    expect(xml).toContain('hreflang="x-default"')
    expect(xml).toContain('<loc>https://pesaba.com/en/legal/privacy</loc>')
    expect(xml).not.toContain('/trust/compliance-matrix')
    expect(xml).not.toContain('%25D')
  })

  test('unsupported locale and missing dynamic content return real 404 responses', async ({ page }) => {
    const invalidLocale = await page.goto('/de/products', { waitUntil: 'domcontentloaded' })
    expect(invalidLocale?.status()).toBe(404)

    const missingProduct = await page.goto(`${EN}/products/data-diodes/not-a-product`, { waitUntil: 'domcontentloaded' })
    expect(missingProduct?.status()).toBe(404)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })

  test('category metadata is localized and uses a crawlable PNG social image', async ({ page }) => {
    await goto(page, `${FA}/products/data-diodes`)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /دیتادیود/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://pesaba.com/og/category/data-diodes.fa.png')
  })

  test('generated Open Graph endpoint returns a PNG image', async ({ request }) => {
    const response = await request.get('og/product/a10.fa.png')
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('image/png')

    const bytes = await response.body()
    expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10])
  })
})
