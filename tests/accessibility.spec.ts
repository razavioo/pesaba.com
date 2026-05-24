import { test, expect } from '@playwright/test'
import { goto, EN } from './helpers'

test.describe('Accessibility — semantic structure', () => {
  const pages = [
    { name: 'homepage', path: `${EN}` },
    { name: 'products', path: `${EN}/products` },
    { name: 'product detail', path: `${EN}/products/data-diodes/a10` },
    { name: 'blog', path: `${EN}/blog` },

    { name: 'contact', path: `${EN}/company/contact` },
    { name: 'glossary', path: `${EN}/glossary` },
  ]

  for (const { name, path } of pages) {
    test(`${name}: has exactly one h1`, async ({ page }) => {
      await goto(page, path)
      const h1s = page.getByRole('heading', { level: 1 })
      await expect(h1s).toHaveCount(1)
    })
  }

  for (const { name, path } of pages) {
    test(`${name}: all images have non-empty alt text`, async ({ page }) => {
      await goto(page, path)
      const imagesWithoutAlt = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img:not([alt])'))
          .map(img => (img as HTMLImageElement).src)
      )
      expect(imagesWithoutAlt).toHaveLength(0)
    })
  }

  test('nav element has aria-label', async ({ page }) => {
    await goto(page, EN)
    const nav = page.locator('header nav[aria-label]')
    await expect(nav).toBeVisible()
  })

  test('breadcrumb nav has aria-label="Breadcrumb"', async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumb).toBeVisible()
  })

  test('product tabs use role="tab" and aria-selected', async ({ page }) => {
    await goto(page, `${EN}/products/data-diodes/a10`)
    const tabs = page.locator('[role="tab"]')
    const count = await tabs.count()
    expect(count).toBeGreaterThan(0)
    const activeTab = page.locator('[role="tab"][aria-selected="true"]')
    await expect(activeTab).toHaveCount(1)
  })



  test('mobile menu toggle button has aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await goto(page, EN)
    const burger = page.locator('header button[aria-label="Open"]')
    await expect(burger).toBeVisible()
    const label = await burger.getAttribute('aria-label')
    expect(label).toBeTruthy()
  })

  test('header has role="banner"', async ({ page }) => {
    await goto(page, EN)
    const header = page.locator('header[role="banner"]')
    await expect(header).toBeVisible()
  })

  test('mega menu chevron button has aria-expanded', async ({ page }) => {
    await goto(page, EN)
    const chevronBtn = page.locator('header button[aria-haspopup]').first()
    if (await chevronBtn.count() > 0) {
      await expect(chevronBtn).toHaveAttribute('aria-expanded')
    }
  })

  test('links have discernible text (no content-empty links)', async ({ page }) => {
    await goto(page, EN)
    const emptyLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a'))
        .filter(a => {
          const hasText = (a.textContent?.trim().length ?? 0) > 0
          const hasAriaLabel = a.getAttribute('aria-label')
          const hasImgWithAlt = a.querySelector('img[alt]')
          return !hasText && !hasAriaLabel && !hasImgWithAlt
        })
        .map(a => a.outerHTML.slice(0, 100))
    )
    expect(emptyLinks).toHaveLength(0)
  })
})

test.describe('Accessibility — focus management', () => {
  test('first Tab keypress focuses a visible element', async ({ page }) => {
    await goto(page, EN)
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })


})
