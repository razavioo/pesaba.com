import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

test.describe('i18n — locale routing', () => {
  test('/ redirects to /fa or /en (default locale)', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL(/\/(fa|en)/)
    expect(page.url()).toMatch(/\/(fa|en)/)
  })

  test('/en renders English content', async ({ page }) => {
    await goto(page, EN)
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })

  test('/fa renders Farsi content', async ({ page }) => {
    await goto(page, FA)
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
    await expect(html).toHaveAttribute('lang', /fa/)
  })

  test('/en pages have lang="en" on <html>', async ({ page }) => {
    await goto(page, EN)
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', /en/)
  })

  test('/en pages have dir="ltr" on <html>', async ({ page }) => {
    await goto(page, EN)
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'ltr')
  })

  test('all EN page nav links preserve /en prefix', async ({ page }) => {
    await goto(page, EN)
    const navLinks = page.locator('header nav a[href]')
    for (const link of await navLinks.all()) {
      const href = await link.getAttribute('href')
      if (href && href.startsWith('/')) {
        expect(href).toMatch(/^\/(en|#)/)
      }
    }
  })

  test('all FA page nav links preserve /fa prefix', async ({ page }) => {
    await goto(page, FA)
    const navLinks = page.locator('header nav a[href]')
    for (const link of await navLinks.all()) {
      const href = await link.getAttribute('href')
      if (href && href.startsWith('/')) {
        expect(href).toMatch(/^\/(fa|#)/)
      }
    }
  })

  test('switching locale from EN to FA via dropdown', async ({ page }) => {
    await goto(page, `${EN}/products`)
    const switcher = page.locator('header button').filter({ hasText: /^en$/i }).first()
    await switcher.click()
    await page.waitForTimeout(300)
    const faOption = page.locator('[role="menuitem"]').filter({ hasText: /fa/i }).first()
    await faOption.click()
    await page.waitForURL(/\/fa/, { timeout: 8000 })
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })

  test('switching locale from FA to EN via dropdown', async ({ page }) => {
    await goto(page, `${FA}/products`)
    const switcher = page.locator('header button').filter({ hasText: /^fa$/i }).first()
    await switcher.click()
    await page.waitForTimeout(300)
    const enOption = page.locator('[role="menuitem"]').filter({ hasText: /en/i }).first()
    await enOption.click()
    await page.waitForURL(/\/en/, { timeout: 8000 })
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'ltr')
  })

  test('product detail page exists in both locales', async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await goto(page, `${FA}/products/data-diodes/a10`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('blog article exists in both locales', async ({ page }) => {
    await goto(page, `${EN}/blog/what-is-aes-algorithm`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await goto(page, `${FA}/blog/what-is-aes-algorithm`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('i18n — RTL layout', () => {
  test('Farsi pages use RTL text direction', async ({ page }) => {
    await goto(page, FA)
    const body = page.locator('body')
    const dir = await body.evaluate(el => window.getComputedStyle(el).direction)
    expect(dir).toBe('rtl')
  })

  test('breadcrumb separator appears in RTL context', async ({ page }) => {
    await goto(page, `${FA}/products/data-diodes`)
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByRole('link').first()).toBeVisible()
  })

  test('contact form email input has dir="ltr" in Farsi', async ({ page }) => {
    await goto(page, `${FA}/company/contact`)
    // The email input has a static dir="ltr" attribute in the template
    const emailInput = page.locator('input[placeholder="you@company.com"]')
    await expect(emailInput).toHaveAttribute('dir', 'ltr')
  })
})
