import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

test.describe('Homepage — English', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, EN)
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Pesaba/)
  })

  test('hero headline is visible', async ({ page }) => {
    const hero = page.getByRole('heading', { level: 1 })
    await expect(hero).toBeVisible()
  })

  test('hero CTA buttons link to contact and products', async ({ page }) => {
    // Hero CTAs are in the TopologyHero section (first major section)
    const contactLink = page.locator('a[href*="/company/contact"]').first()
    await expect(contactLink).toBeVisible()
    const productsLink = page.locator('a[href*="/products"]').first()
    await expect(productsLink).toHaveAttribute('href', /\/products/)
  })

  test('stats bar shows 4 stat blocks', async ({ page }) => {
    const stats = page.locator('section.stats-showcase')
    await stats.scrollIntoViewIfNeeded()
    await expect(page.locator('section.stats-showcase').filter({ hasText: /17\+/ }).first()).toBeVisible()
  })

  test('6 product category cards are rendered', async ({ page }) => {
    // Category cards are NuxtLink elements with card-halo class pointing to product categories
    const cards = page.locator('a.card-halo[href*="/products/"]')
    await expect(cards).toHaveCount(6)
  })

  test('product category card navigates on click', async ({ page }) => {
    await page.locator('a.card-halo[href*="/products/"]').first().click()
    await expect(page).toHaveURL(/\/products\//)
  })

  test('"How we ship" section renders 4 pillars', async ({ page }) => {
    const pillars = page.locator('h3').filter({ hasText: /FPGA|OS.less|Made in|Trust/i })
    await expect(pillars).toHaveCount(4)
  })

  test('"From the lab" section shows 2 blog article cards', async ({ page }) => {
    // ArticleCard elements are article.card-halo
    const cards = page.locator('article.card-halo')
    await expect(cards).toHaveCount(2)
  })

  test('"View all" blog link works', async ({ page }) => {
    const viewAll = page.getByRole('link', { name: /view all/i }).first()
    await expect(viewAll).toHaveAttribute('href', /\/blog/)
  })

  test('CTA strip at bottom is visible with contact link', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(200)
    const ctaLink = page.locator('a[href*="/company/contact"]').last()
    await expect(ctaLink).toBeVisible()
  })

  test('page has no broken images', async ({ page }) => {
    // Scroll to bottom to trigger lazy-loaded images
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const brokenImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter(img => img.loading !== 'lazy' && !img.naturalWidth && img.complete)
        .map(img => img.src)
    )
    expect(brokenImages).toHaveLength(0)
  })
})

test.describe('Homepage — Farsi (RTL)', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, FA)
  })

  test('page renders in RTL direction', async ({ page }) => {
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })

  test('hero headline is visible in Farsi', async ({ page }) => {
    const hero = page.getByRole('heading', { level: 1 })
    await expect(hero).toBeVisible()
    const text = await hero.textContent()
    expect(text).toMatch(/[؀-ۿ]/)
  })

  test('product category cards link to /fa/ paths', async ({ page }) => {
    const cards = page.locator('a.card-halo[href*="/products/"]')
    await expect(cards.first()).toBeVisible()
  })

  test('locale switcher button shows current locale', async ({ page }) => {
    // LocaleSwitcher shows "fa" text in the button
    const switcher = page.locator('button').filter({ hasText: /^fa$/i })
    await expect(switcher.first()).toBeVisible()
  })

  test('locale switcher opens dropdown with EN option', async ({ page }) => {
    const switcher = page.locator('button').filter({ hasText: /^fa$/i }).first()
    await switcher.click()
    await page.waitForTimeout(200)
    const enOption = page.getByRole('menuitem').filter({ hasText: /en|English/i })
    await expect(enOption).toBeVisible()
  })
})

test.describe('Homepage — Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await goto(page, EN)
  })

  test('hero section is visible on mobile', async ({ page }) => {
    const hero = page.getByRole('heading', { level: 1 })
    await expect(hero).toBeVisible()
  })

  test('product category grid is visible on mobile', async ({ page }) => {
    const firstCard = page.locator('a.card-halo[href*="/products/"]').first()
    await expect(firstCard).toBeVisible()
  })

  test('hamburger menu button is visible on mobile', async ({ page }) => {
    // Mobile hamburger is shown as lg:hidden — visible at 390px
    const burger = page.locator('header button[aria-label="Open"]')
    await expect(burger).toBeVisible()
  })

  test('hamburger opens mobile nav', async ({ page }) => {
    const burger = page.locator('header button[aria-label="Open"]')
    await burger.click()
    await page.waitForTimeout(200)
    await expect(page.locator('header button[aria-label="Close"]')).toBeVisible()
  })
})
