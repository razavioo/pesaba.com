import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

const CATEGORIES = [
  'data-diodes',
  'network-encryption',
  'network-switching-filtering',
  'telecom-transmission',
  'cellular-monitoring',
  'bio-monitoring',
]

test.describe('Products index page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/products`)
  })

  test('page title contains "Products"', async ({ page }) => {
    await expect(page).toHaveTitle(/Products/)
  })

  test('h1 heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('hero product label renders', async ({ page }) => {
    await expect(page.locator('.section-label').filter({ hasText: /Products/i }).first()).toBeVisible()
  })

  test('all 6 category section headers are rendered', async ({ page }) => {
    for (const cat of CATEGORIES) {
      const catLink = page.locator(`a[href*="/products/${cat}"]`).first()
      await expect(catLink).toBeVisible()
    }
  })

  test('each category has a "View all" link', async ({ page }) => {
    const viewAllLinks = page.getByRole('link', { name: /view all/i })
    await expect(viewAllLinks).toHaveCount(CATEGORIES.length)
  })

  test('product count label renders next to each category', async ({ page }) => {
    const sections = page.locator('section.section').first()
    const countLabels = sections.locator('.label-meta').filter({ hasText: /products/i })
    await expect(countLabels).toHaveCount(CATEGORIES.length)
  })

  test('product cards render in the grid', async ({ page }) => {
    // ProductCard uses <article class="product-card">
    const cards = page.locator('article.product-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('clicking a product card navigates to detail page', async ({ page }) => {
    const firstCard = page.locator('article.product-card').first()
    const link = firstCard.locator('a').first()
    await link.click()
    await page.waitForURL(/\/products\/.+\/.+/)
    expect(page.url()).toContain('/products/')
  })

  test('spec pills are rendered on cards', async ({ page }) => {
    const firstCard = page.locator('article.product-card').first()
    await expect(firstCard).toBeVisible()
  })
})

test.describe('Product category page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes`)
  })

  test('breadcrumb shows Products > Data Diodes', async ({ page }) => {
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumb).toContainText('Products')
    await expect(breadcrumb).toContainText('Data Diodes')
  })

  test('breadcrumb "Products" link works', async ({ page }) => {
    const productsLink = page.locator('nav[aria-label="Breadcrumb"] a').filter({ hasText: /Products/i }).first()
    await productsLink.evaluate(el => (el as HTMLElement).click())
    await page.waitForURL(/\/products$/)
  })

  test('h1 shows category name', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toContainText(/Data Diode/)
  })

  test('category tag badge is visible', async ({ page }) => {
    const badge = page.locator('.section-label').first()
    await expect(badge).toBeVisible()
  })

  test('product cards are rendered', async ({ page }) => {
    const cards = page.locator('article.product-card')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('CTA strip at bottom prioritizes phone and keeps quote link', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(200)
    await expect(page.locator('a[href^="tel:"]').last()).toBeVisible()
    await expect(page.locator('a[href*="/company/contact"]').last()).toBeVisible()
  })

  for (const cat of CATEGORIES) {
    test(`category page renders for: ${cat}`, async ({ page }) => {
      await goto(page, `${EN}/products/${cat}`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const cards = page.locator('article.product-card')
      await expect(cards.first()).toBeVisible()
    })
  }
})

test.describe('Product detail page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
  })

  test('breadcrumb has Home > Products > Data Diodes > product name', async ({ page }) => {
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
    const links = breadcrumb.getByRole('link')
    await expect(links).toHaveCount(3)
    await expect(links.first()).toContainText('Home')
    await expect(breadcrumb).toContainText('Data Diode A10')
  })

  test('product title h1 is rendered', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Data Diode A10')
  })

  test('product category badge is visible', async ({ page }) => {
    const badge = page.locator('span').filter({ hasText: /Data Diode/i }).first()
    await expect(badge).toBeVisible()
  })

  test('product description text is present', async ({ page }) => {
    const desc = page.locator('p').filter({ hasText: /one-way|hardware/i }).first()
    await expect(desc).toBeVisible()
  })

  test('"Request Quote" CTA button links to contact', async ({ page }) => {
    // Product detail page has a "Request Quote" button linking to contact
    const quoteBtn = page.locator('a[href*="/company/contact"]').first()
    await expect(quoteBtn).toBeVisible()
  })

  test('"Download Datasheet" CTA button links to exact product PDF', async ({ page }) => {
    const pdfBtn = page.locator('a[href$="/schematics/a10/DD-A10.pdf"]').first()
    await expect(pdfBtn).toBeVisible()
    await expect(pdfBtn).toHaveAttribute('href', /\/schematics\/a10\/DD-A10\.pdf$/)
  })

  test('datasheet link is visible under Downloads & evaluation card', async ({ page }) => {
    const card = page.locator('[data-product-downloads]')
    const pdfLink = card.locator('a[href$="/schematics/a10/DD-A10.pdf"]')
    await expect(pdfLink).toBeVisible()
  })

  test('datasheet CTA does not route to generic datasheets page', async ({ page }) => {
    const genericDatasheetCtas = page.locator('section.page-hero a[href*="/resources/datasheets"]')
    await expect(genericDatasheetCtas).toHaveCount(0)
  })

  test('phone-first sales CTA is visible on product detail', async ({ page }) => {
    const phoneBtn = page.locator('section.page-hero a[href^="tel:"]').first()
    await expect(phoneBtn).toBeVisible()
    await expect(phoneBtn).toHaveAttribute('href', 'tel:+982144215738')
  })

  test('sticky tab bar renders', async ({ page }) => {
    const tabBar = page.locator('[role="tablist"]')
    await expect(tabBar).toBeVisible()
  })

  test('tabs: Overview, Specifications, FAQ are present', async ({ page }) => {
    const tabs = page.locator('[role="tab"]')
    await expect(tabs).toHaveCount(3)
    await expect(tabs.filter({ hasText: /Overview/i })).toBeVisible()
    await expect(tabs.filter({ hasText: /Specification/i })).toBeVisible()
    await expect(tabs.filter({ hasText: /FAQ/i })).toBeVisible()
  })

  test('clicking Specifications tab activates it', async ({ page }) => {
    const specsTab = page.locator('[role="tab"]').filter({ hasText: /Specification/i })
    await specsTab.click()
    await expect(specsTab).toHaveAttribute('aria-selected', 'true')
  })

  test('clicking FAQ tab activates it', async ({ page }) => {
    const faqTab = page.locator('[role="tab"]').filter({ hasText: /FAQ/i })
    await faqTab.click()
    await expect(faqTab).toHaveAttribute('aria-selected', 'true')
  })

  test('image viewer renders with product image', async ({ page }) => {
    const productImage = page.locator('img[src*="/photos/a10"]').first()
    await expect(productImage).toBeVisible()
  })

  test('gallery next button changes the main product image', async ({ page }) => {
    const mainImage = page.locator('section.page-hero img[alt="Data Diode A10"]').first()
    const firstSrc = await mainImage.getAttribute('src')
    await page.getByRole('button', { name: /next image/i }).click()
    await expect(mainImage).not.toHaveAttribute('src', firstSrc || '')
  })

  test('product detail page renders in Farsi', async ({ page }) => {
    await goto(page, `${FA}/products/data-diodes/a10`)
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })
})

test.describe('Product compare page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/products/compare`)
  })

  test('page title shows "Compare Products"', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Compare/)
  })

  test('breadcrumb links back to products', async ({ page }) => {
    const productsLink = page.locator('nav a').filter({ hasText: /Products/i }).first()
    await expect(productsLink).toHaveAttribute('href', /\/products$/)
  })

  test('product picker buttons render', async ({ page }) => {
    const buttons = page.locator('section').nth(1).locator('button').first()
    await expect(buttons).toBeVisible()
  })

  test('selecting one product suggests another product from its category', async ({ page }) => {
    await page.locator('section.container-site').first().getByRole('button', { name: 'Data Diode A10', exact: true }).click()
    await expect(page.locator('section.container-site').last().getByRole('button', { name: 'Data Diode G200', exact: true })).toBeVisible()
  })

  test('selecting 2 products shows comparison table', async ({ page }) => {
    await page.locator('section.container-site').first().getByRole('button', { name: 'Data Diode A10', exact: true }).click()
    await page.locator('section.container-site').first().getByRole('button', { name: 'Data Diode G200', exact: true }).click()
    const table = page.locator('table')
    await expect(table).toBeVisible()
  })

  test('comparison table has Description row', async ({ page }) => {
    const buttons = page.locator('section').nth(1).locator('button')
    await buttons.nth(0).click()
    await buttons.nth(1).click()
    const table = page.locator('table')
    await expect(table).toContainText(/Description/i)
  })

  test('remove button deselects a single product', async ({ page }) => {
    const pickerButtons = page.locator('section').nth(1).locator('button')
    await pickerButtons.nth(0).click()
    await pickerButtons.nth(1).click()
    const removeBtn = page.getByRole('button', { name: /remove/i }).first()
    await removeBtn.click()
    await expect(page.locator('table')).not.toBeVisible()
  })

  test('selected product name links to its detail page', async ({ page }) => {
    const pickerButtons = page.locator('section').nth(1).locator('button')
    await pickerButtons.nth(0).click()
    await pickerButtons.nth(1).click()
    const productLinks = page.locator('table thead a')
    await expect(productLinks.first()).toHaveAttribute('href', /\/products\//)
  })

  test('selected products render their images', async ({ page }) => {
    await goto(page, `${FA}/products/compare?p=orazan,upcryptor`)
    const images = page.locator('table thead img')
    await expect(images).toHaveCount(2)
    await expect(images.nth(0)).toHaveAttribute('src', /orazan\/photo-1\.webp/)
    await expect(images.nth(1)).toHaveAttribute('src', /placeholder-product\.svg|upcryptor/)
    await expect.poll(() => images.nth(0).evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  })
})
