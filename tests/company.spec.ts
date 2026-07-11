import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/company/contact`)
  })

  test('page title contains "Contact"', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/)
  })

  test('h1 shows contact headline', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/team|talk/i)
  })

  test('email address is visible and is a mailto link', async ({ page }) => {
    // Use first() — email appears in both main content and footer
    const emailLink = page.locator('a[href^="mailto:"]').first()
    await expect(emailLink).toBeVisible()
    await expect(emailLink).toContainText(/pesaba\.com/)
  })

  test('phone number is a tel link', async ({ page }) => {
    const phoneLink = page.locator('a[href^="tel:"]').first()
    await expect(phoneLink).toBeVisible()
    await expect(phoneLink).toHaveAttribute('href', 'tel:+982144215738')
  })

  test('phone-first sales card is visible before the form', async ({ page }) => {
    await expect(page.getByText(/Fastest path: call our sales team/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /Call Sales Now/i }).first()).toHaveAttribute('href', 'tel:+982144215738')
  })

  test('contact form has required name field', async ({ page }) => {
    const nameField = page.locator('#contact-name')
    await expect(nameField).toBeVisible()
    await expect(nameField).toHaveAttribute('required', '')
  })

  test('contact form has email field', async ({ page }) => {
    // Contact form email has placeholder "you@company.com" (footer newsletter has different placeholder)
    const emailField = page.locator('input[placeholder="you@company.com"]')
    await expect(emailField).toBeVisible()
    await expect(emailField).toHaveAttribute('required', '')
  })

  test('contact form has optional company field', async ({ page }) => {
    const companyField = page.locator('#contact-company')
    await expect(companyField).toBeVisible()
  })

  test('contact form has textarea for message', async ({ page }) => {
    const textarea = page.locator('form textarea')
    await expect(textarea).toBeVisible()
  })

  test('submit button is visible', async ({ page }) => {
    const submitBtn = page.locator('form').getByRole('button', { name: /send|submit|request/i })
    await expect(submitBtn).toBeVisible()
  })

  test('form validates required fields on empty submit', async ({ page }) => {
    const submitBtn = page.locator('form').getByRole('button', { name: /send|submit|request/i })
    await submitBtn.click()
    const nameField = page.locator('#contact-name')
    const isValid = await nameField.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBe(false)
  })

  test('form validates invalid email', async ({ page }) => {
    await page.locator('#contact-name').fill('Test User')
    await page.locator('input[placeholder="you@company.com"]').fill('not-an-email')
    const submitBtn = page.locator('form').getByRole('button', { name: /send|submit|request/i })
    await submitBtn.click()
    const emailField = page.locator('input[placeholder="you@company.com"]')
    const isValid = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBe(false)
  })

  test('form fills without error', async ({ page }) => {
    await page.locator('#contact-name').fill('Test User')
    await page.locator('#contact-company').fill('Test Co')
    await page.locator('input[placeholder="you@company.com"]').fill('test@example.com')
    await page.locator('form textarea').fill('This is a test message from Playwright.')
    const submitBtn = page.locator('form').getByRole('button', { name: /send|submit|request/i })
    await expect(submitBtn).toBeEnabled()
  })

  test('contact page works in Farsi', async ({ page }) => {
    await goto(page, `${FA}/company/contact`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const html = page.locator('html')
    await expect(html).toHaveAttribute('dir', 'rtl')
  })
})

test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/company/about`)
  })

  test('h1 heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('"Why Pesaba" section is visible', async ({ page }) => {
    const section = page.locator('section, div').filter({ hasText: /why pesaba/i }).first()
    await expect(section).toBeVisible()
  })

  test('about page renders in Farsi', async ({ page }) => {
    await goto(page, `${FA}/company/about`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Careers page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/company/careers`)
  })

  test('h1 heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('"Open Positions" section is visible', async ({ page }) => {
    const section = page.locator('section, div, h2').filter({ hasText: /open positions/i }).first()
    await expect(section).toBeVisible()
  })
})
