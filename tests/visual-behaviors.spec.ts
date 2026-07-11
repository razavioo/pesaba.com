import { test, expect } from '@playwright/test'
import { goto, EN } from './helpers'

test.describe('Theme mode', () => {
  test('site stays in light mode by default', async ({ page }) => {
    await goto(page, EN)
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class') || ''
    expect(initialClass).toContain('light')
  })
})

test.describe('Header scroll backdrop', () => {
  test('keeps the hero flush with the viewport and paints the backdrop with the header', async ({ page }) => {
    await goto(page, EN)

    const initialHeroTop = await page.locator('.page-hero').first().evaluate((hero) => hero.getBoundingClientRect().top)
    expect(initialHeroTop).toBe(0)

    await page.evaluate(() => window.scrollTo(0, 100))
    await page.waitForTimeout(350)

    const backdrop = await page.locator('.site-header').evaluate((header) => {
      const styles = getComputedStyle(header, '::before')
      return {
        headerHeight: header.getBoundingClientRect().height,
        height: Number.parseFloat(styles.height),
        position: styles.position,
      }
    })

    expect(backdrop.position).toBe('absolute')
    expect(backdrop.height).toBeCloseTo(backdrop.headerHeight, 0)
  })
})

test.describe('Product image viewer', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/k200`)
  })

  test('main image renders in product image container', async ({ page }) => {
    const container = page.locator('section.page-hero .product-hero-image').first()
    await expect(container).toBeVisible()
  })

  test('product image is visible', async ({ page }) => {
    const productImage = page.locator('img[src*="/photos/k200"]').first()
    await expect(productImage).toBeVisible()
  })

  test('clicking thumbnail selects it (active current state)', async ({ page }) => {
    const thumbnails = page.locator('button[aria-label^="Show image"]')
    if (await thumbnails.count() > 1) {
      const second = thumbnails.nth(1)
      await second.click()
      await expect(second).toHaveAttribute('aria-current', 'true')
    }
  })
})

test.describe('Product card hover states', () => {
  test('product card is visible and interactive', async ({ page }) => {
    await goto(page, `${EN}/products`)
    const card = page.locator('article.product-card').first()
    await card.hover()
    await expect(card).toBeVisible()
  })
})

test.describe('CTA strip', () => {
  test('CTA strip renders on homepage', async ({ page }) => {
    await goto(page, EN)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(200)
    const strip = page.locator('section').filter({ has: page.locator('a[href^="tel:"]') }).last()
    await expect(strip).toBeVisible()
  })

  test('CTA strip primary button links to phone sales', async ({ page }) => {
    await goto(page, EN)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(200)
    const ctaBtn = page.locator('a[href^="tel:"]').last()
    await expect(ctaBtn).toBeVisible()
    await expect(ctaBtn).toHaveAttribute('href', 'tel:+982144215738')
  })
})

test.describe('404 error page', () => {
  test('non-existent page shows error UI', async ({ page }) => {
    await page.goto(`${EN}/this-page-does-not-exist-xyz`)
    await page.waitForLoadState('networkidle')
    const content = await page.content()
    const isNotFound = content.includes('404') || content.includes('not found') || content.includes('Not Found')
    expect(isNotFound).toBeTruthy()
  })
})

test.describe('Performance — lazy loading', () => {
  test('product images use lazy loading', async ({ page }) => {
    await goto(page, `${EN}/products`)
    const lazyImages = page.locator('img[loading="lazy"]')
    const count = await lazyImages.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Tech page', () => {
  test('technology page renders h1', async ({ page }) => {
    await goto(page, `${EN}/technology`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Solutions page', () => {
  test('solutions page renders h1', async ({ page }) => {
    await goto(page, `${EN}/solutions`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Industries page', () => {
  test('industries page renders h1', async ({ page }) => {
    await goto(page, `${EN}/industries`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
