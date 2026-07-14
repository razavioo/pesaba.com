import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

test.describe('Glossary index page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/glossary`)
  })

  test('page title contains "Glossary"', async ({ page }) => {
    await expect(page).toHaveTitle(/Glossary/)
  })

  test('h1 heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Glossary/)
  })

  test('subtitle describes the glossary', async ({ page }) => {
    const sub = page.locator('p').filter({ hasText: /technical terms|encryption|OT/i }).first()
    await expect(sub).toBeVisible()
  })

  test('A–Z alphabet index is rendered', async ({ page }) => {
    // Letters rendered as buttons — at least the active ones
    const letterButtons = page.locator('button[class*="font-mono"]')
    await expect(letterButtons.first()).toBeVisible()
    const count = await letterButtons.count()
    expect(count).toBe(26) // full alphabet
  })

  test('active letters are clickable (not disabled)', async ({ page }) => {
    const activeLetters = page.locator('button[class*="font-mono"]:not([disabled])')
    await expect(activeLetters.first()).toBeEnabled()
  })

  test('disabled letters are non-interactive', async ({ page }) => {
    const disabledLetters = page.locator('button[disabled]')
    const count = await disabledLetters.count()
    // Some letters have no terms
    expect(count).toBeGreaterThan(0)
  })

  test('clicking a letter scrolls to that letter section', async ({ page }) => {
    // Click letter C (should exist: CSSR, etc.)
    const letterC = page.locator('button[class*="font-mono"]').filter({ hasText: 'C' }).first()
    if (await letterC.isEnabled()) {
      await letterC.click()
      await page.waitForTimeout(500)
      // The letter section container should be in view
      const section = page.locator('#letter-C')
      await expect(section).toBeInViewport()
    }
  })

  test('term cards do not render Farsi title on English page', async ({ page }) => {
    const termCards = page.locator('a[href*="/en/glossary/"]')
    await expect(termCards.first()).toBeVisible()
    // Farsi title should not be displayed on the English page
    const farsiTitle = termCards.first().locator('[dir="rtl"]')
    await expect(farsiTitle).not.toBeVisible()
  })

  test('term card shows short definition', async ({ page }) => {
    const termCard = page.locator('a[href*="/en/glossary/"]').first()
    const definition = termCard.locator('span').last()
    await expect(definition).toBeVisible()
  })

  test('clicking a term navigates to its detail page', async ({ page }) => {
    const firstTerm = page.locator('a[href*="/en/glossary/"]').first()
    await firstTerm.click()
    await page.waitForURL(/\/glossary\//)
    expect(page.url()).toMatch(/\/glossary\/[a-z]/)
  })

  test('glossary renders in Farsi', async ({ page }) => {
    await goto(page, `${FA}/glossary`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const terms = page.locator('a[href*="/fa/glossary/"]')
    await expect(terms.first()).toBeVisible()
    // English title displayed alongside Farsi on the Farsi page
    const englishTitle = terms.first().locator('[dir="ltr"]')
    await expect(englishTitle).toBeVisible()
  })
})

test.describe('Glossary term page', () => {
  const TERM_SLUG = 'firewall'

  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/glossary/${TERM_SLUG}`)
  })

  test('term title h1 is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Firewall/i)
  })

  test('term page renders in Farsi', async ({ page }) => {
    await goto(page, `${FA}/glossary/${TERM_SLUG}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('related products link to product pages', async ({ page }) => {
    await goto(page, `${FA}/glossary/pki`)
    const productLink = page.locator('a[href="/fa/products/network-encryption/emx-6"]')
    await expect(productLink).toBeVisible()
    await expect(page.getByRole('heading', { name: 'محصولات مرتبط پرتو ارتباط صبا' })).toHaveCount(0)
    await expect(page.getByText('همه اصطلاحات')).toHaveCount(0)
  })

  test('Persian related product cards do not use the English safety fallback', async ({ page }) => {
    await goto(page, `${FA}/glossary/cssr`)
    const capellaCard = page.locator('a[href="/fa/products/cellular-monitoring/capella"]')
    await expect(capellaCard).toBeVisible()
    await expect(capellaCard.locator('p')).not.toContainText(/is listed in the Pesaba catalogue/i)
    await expect(capellaCard.locator('p')).toContainText(/کاپلا|کاتالوگ پسابا/)

    const venusPioneerCard = page.locator('a[href="/fa/products/cellular-monitoring/venus-pioneer"]')
    await expect(venusPioneerCard).toBeVisible()
    await expect(venusPioneerCard.locator('p')).not.toContainText(/is listed in the Pesaba catalogue/i)
    await expect(venusPioneerCard.locator('p')).toContainText(/ونوس پایونیر|کاتالوگ پسابا/)
  })

  test('related product content is rendered once with the glossary anchor', async ({ page }) => {
    await goto(page, `${FA}/glossary/os-less#محصولات-مرتبط-پرتو-ارتباط-صبا`)
    await expect(page.locator('#محصولات-مرتبط-پرتو-ارتباط-صبا')).toBeVisible()
    await expect(page.getByText('رمزنگار FPGA-محور بدون سیستم‌عامل؛ هیچ OS patch cycle ندارد.')).toHaveCount(0)
    await expect(page.locator('a[href="/fa/products/network-encryption/emx-6"]')).toHaveCount(1)
    await expect(page.locator('a[href="/fa/products/data-diodes/g200"]')).toHaveCount(1)
  })
})
