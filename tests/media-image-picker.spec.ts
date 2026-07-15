import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const OWNER_EMAIL = process.env.CMS_OWNER_EMAIL || 'owner@pesaba.local'
const OWNER_PASSWORD = process.env.CMS_OWNER_PASSWORD || 'PesabaLocalOwner-2026'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/admin/login')
  // The form is server-rendered; wait for Vue to attach its submit handler before clicking.
  await page.waitForTimeout(500)
  await page.getByLabel('ایمیل').fill(OWNER_EMAIL)
  await page.getByLabel('گذرواژه').fill(OWNER_PASSWORD)
  await page.getByRole('button', { name: 'ورود به پنل' }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

test.describe('Hero image picker', () => {
  test('uses the full field width and supports modal, upload, selection, removal, and drag state', async ({ page }) => {
    await login(page)
    await page.goto('/admin/content/new')
    await page.waitForTimeout(500)

    const specialData = page.locator('aside').getByText('داده‌های ویژه').locator('..')
    const picker = specialData.getByTestId('media-image-picker')
    await expect(picker).toBeVisible()
    await expect(picker).toBeEnabled()
    const pickerWidth = await picker.evaluate(element => element.getBoundingClientRect().width)
    expect(pickerWidth).toBeGreaterThan(240)

    await picker.click()
    const dialog = page.getByTestId('media-picker-dialog')
    await expect(dialog).toBeVisible()
    const dropzone = page.getByTestId('media-upload-dropzone')
    await dropzone.dispatchEvent('dragenter')
    await expect(dropzone).toHaveClass(/dropzone--dragging/)
    await dropzone.dispatchEvent('dragleave')
    await expect(dropzone).not.toHaveClass(/dropzone--dragging/)

    await dialog.locator('input[type="file"]').setInputFiles({
      name: `hero-picker-${Date.now()}.png`,
      mimeType: 'image/png',
      // A unique byte suffix avoids the CMS content-hash duplicate guard while preserving a valid PNG.
      buffer: Buffer.concat([await readFile('public/pesaba-mark-192.png'), Buffer.from(String(Date.now()))]),
    })
    await expect(dialog).toBeHidden()
    await expect(picker.locator('img')).toBeVisible()
    await expect(specialData.getByRole('button', { name: 'حذف', exact: true })).toBeVisible()

    await picker.click({ force: true })
    await expect(dialog).toBeVisible()
    const asset = dialog.locator('.asset').first()
    await expect(asset).toBeVisible()
    await asset.click({ force: true })
    await expect(dialog).toBeHidden()

    await specialData.getByRole('button', { name: 'حذف', exact: true }).click({ force: true })
    await expect(picker.locator('img')).toHaveCount(0)
  })
})
