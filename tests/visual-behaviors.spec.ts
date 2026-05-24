import { test, expect } from '@playwright/test'
import { goto, EN } from './helpers'

test.describe('Theme mode', () => {
  test('site stays in dark mode by default', async ({ page }) => {
    await goto(page, EN)
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class') || ''
    expect(initialClass).toContain('dark')
  })
})

test.describe('Product image viewer', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/k200`)
  })

  test('main image renders in 4:3 aspect container', async ({ page }) => {
    // The image viewer is a div with aspect-[4/3] inside the hero section
    // Use the one inside .space-y-3 (image viewer area), not the ProductCard links
    const container = page.locator('section .space-y-3 .aspect-\\[4\\/3\\]')
    await expect(container).toBeVisible()
  })

  test('product image is visible', async ({ page }) => {
    const productImage = page.locator('img[src*="/products/k200"]').first()
    await expect(productImage).toBeVisible()
  })

  test('clicking thumbnail selects it (active border)', async ({ page }) => {
    const thumbnails = page.locator('button').filter({ has: page.locator('img[src*="/products/k200"]') })
    if (await thumbnails.count() > 1) {
      const second = thumbnails.nth(1)
      await second.click()
      await expect(second).toHaveClass(/border-photon-500/)
    }
  })
})

test.describe('Stat block animation', () => {
  test('stat blocks render with numeric values', async ({ page }) => {
    await goto(page, EN)
    const statsSection = page.locator('section').filter({ hasText: /17\+/ }).first()
    await expect(statsSection).toBeVisible()
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
    const strip = page.locator('section, div').filter({ has: page.locator('a[href*="/company/contact"]') }).last()
    await expect(strip).toBeVisible()
  })

  test('CTA strip primary button links to contact', async ({ page }) => {
    await goto(page, EN)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(200)
    const ctaBtn = page.locator('a[href*="/company/contact"]').last()
    await expect(ctaBtn).toBeVisible()
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
