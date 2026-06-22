import { type Page, expect } from '@playwright/test'

export const EN = '/en'
export const FA = '/fa'

/** Navigate and wait for Nuxt hydration */
export async function goto(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'load' })
  await page.waitForTimeout(800)
}

/** Assert no visible console errors (excluding known noise) */
export async function expectNoConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('[nuxt]')) {
      errors.push(msg.text())
    }
  })
  return errors
}

/** Assert element is visible and in viewport */
export async function expectVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible()
}

/** Check that a link navigates to the correct URL */
export async function expectLinkHref(page: Page, selector: string, expectedHref: string | RegExp) {
  const link = page.locator(selector).first()
  await expect(link).toHaveAttribute('href', expectedHref)
}

/** Scroll to bottom of page */
export async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
}
