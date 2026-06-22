import { test, expect } from '@playwright/test'
import { goto, EN } from './helpers'

test.describe('Navigation header', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, EN)
  })

  test('logo links to homepage', async ({ page }) => {
    const logo = page.locator('header').getByRole('link', { name: 'Pesaba' }).first()
    await expect(logo).toBeVisible()
  })

  test('logo text "Pesaba" is visible', async ({ page }) => {
    await expect(page.locator('header').getByText('Pesaba').first()).toBeVisible()
  })

  test('main nav items are visible on desktop', async ({ page }) => {
    // Products/Solutions have submenus so they render as <button>, not <a>
    // Home/Technology/Trust have no subItems so they render as <a> (NuxtLink)
    const nav = page.locator('header nav').first()
    await expect(nav.getByRole('link', { name: /^Home$/i }).first()).toBeVisible()
    await expect(nav.locator('button').filter({ hasText: /Products/i }).first()).toBeVisible()
    await expect(nav.getByRole('link', { name: /Technology/i }).first()).toBeVisible()
    await expect(nav.locator('button').filter({ hasText: /Solutions/i }).first()).toBeVisible()
  })

  test('phone-first sales CTA is in header', async ({ page }) => {
    const cta = page.locator('header a[href^="tel:"]').first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', 'tel:+982144215738')
  })

  test('quote/contact CTA remains available in header on desktop', async ({ page }) => {
    const cta = page.locator('header a[href*="/company/contact"]').first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /\/company\/contact/)
  })


  test('header becomes solid on scroll', async ({ page }) => {
    const header = page.locator('header')
    // Initial header is h-20; after scroll it shrinks to h-16
    await expect(header).toHaveClass(/h-20/)
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(500)
    await expect(header).toHaveClass(/h-16/)
  })

  test('locale switcher button is present in header', async ({ page }) => {
    // Shows current locale "English"
    const switcher = page.locator('header button').filter({ hasText: /English/i }).first()
    await expect(switcher).toBeVisible()
  })

  test('locale switcher opens dropdown', async ({ page }) => {
    const switcher = page.locator('header button').filter({ hasText: /English/i }).first()
    await switcher.click()
    await page.waitForTimeout(200)
    const dropdown = page.locator('[role="menu"]')
    await expect(dropdown).toBeVisible()
  })

  test('switching to Farsi redirects to /fa', async ({ page }) => {
    const switcher = page.locator('header button').filter({ hasText: /English/i }).first()
    await switcher.click()
    await page.waitForTimeout(300)
    // Dropdown items have role="menuitem" with text "fa فارسی"
    const faOption = page.locator('[role="menuitem"]').filter({ hasText: /fa/i }).first()
    await faOption.click()
    await page.waitForURL(/\/fa/, { timeout: 8000 })
    expect(page.url()).toContain('/fa')
  })

  test('theme toggle button is exposed publicly', async ({ page }) => {
    const themeBtn = page.locator('button[aria-label*="Switch to"]')
    await expect(themeBtn).toHaveCount(1)
  })
})

test.describe('Navigation — Mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await goto(page, EN)
  })

  test('desktop nav is hidden on mobile', async ({ page }) => {
    const desktopNav = page.locator('header nav.hidden')
    await expect(desktopNav.first()).toBeHidden()
  })

  test('hamburger opens mobile menu with Home link', async ({ page }) => {
    const burger = page.locator('header button[aria-label="Open"]')
    await burger.click()
    const mobileNav = page.locator('div.fixed nav').first()
    await expect(mobileNav.getByRole('link', { name: /^Home$/i })).toBeVisible()
    await expect(mobileNav.getByRole('link', { name: /^Products$/i })).toBeVisible()
  })

  test('mobile menu closes after nav link click', async ({ page }) => {
    const burger = page.locator('header button[aria-label="Open"]')
    await burger.click()
    const productsLink = page.locator('div.fixed nav').first().getByRole('link', { name: /^Products$/i })
    await productsLink.click()
    await page.waitForURL(/\/products/)
    expect(page.url()).toContain('/products')
  })
})

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, EN)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(200)
  })

  test('footer is rendered', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('footer contains Pesaba tagline', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toContainText(/Securing critical networks|پاسداری از/)
  })

  test('footer navigation links work', async ({ page }) => {
    const footer = page.locator('footer')
    const productLink = footer.getByRole('link', { name: /Products/i }).first()
    await expect(productLink).toHaveAttribute('href', /\/products/)
  })

  test('footer contact email is displayed', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toContainText(/pesaba\.com|admin@/)
  })

  test('footer phone number is a tel link', async ({ page }) => {
    const footer = page.locator('footer')
    const tel = footer.locator('a[href^="tel:"]')
    await expect(tel).toBeVisible()
  })
})
