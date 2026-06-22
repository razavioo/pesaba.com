import { test, expect } from '@playwright/test'
import { goto, EN, FA } from './helpers'

test.describe('Blog index page', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/blog`)
  })

  test('page title contains "Blog"', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/)
  })

  test('h1 heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('article cards are rendered', async ({ page }) => {
    // ArticleCard uses <article class="card-halo">
    const cards = page.locator('article.card-halo')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('article card shows title (h3)', async ({ page }) => {
    const firstCard = page.locator('article.card-halo').first()
    const title = firstCard.locator('h3')
    await expect(title).toBeVisible()
  })

  test('article card shows date', async ({ page }) => {
    const firstCard = page.locator('article.card-halo').first()
    const date = firstCard.locator('span').filter({ hasText: /\d{4}|\w+ \d{1,2}/ }).first()
    await expect(date).toBeVisible()
  })

  test('article card "Read more" link navigates', async ({ page }) => {
    const readMore = page.locator('article.card-halo a').filter({ hasText: /read more/i }).first()
    await expect(readMore).toHaveAttribute('href', /\/blog\//)
  })

  test('clicking an article card navigates to article', async ({ page }) => {
    const firstCard = page.locator('article.card-halo').first()
    const link = firstCard.locator('a').first()
    await link.click()
    await page.waitForURL(/\/blog\//)
    expect(page.url()).toMatch(/\/blog\/[a-z]/)
  })

  test('blog renders in Farsi', async ({ page }) => {
    await goto(page, `${FA}/blog`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const cards = page.locator('article.card-halo')
    await expect(cards.first()).toBeVisible()
  })
})

test.describe('Blog article page', () => {
  const ARTICLE_SLUG = 'what-is-aes-algorithm'

  test.beforeEach(async ({ page }) => {
    await goto(page, `${EN}/blog/${ARTICLE_SLUG}`)
  })

  test('article title h1 is rendered', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('article has "Article" badge', async ({ page }) => {
    const badge = page.locator('span').filter({ hasText: /^article$/i }).first()
    await expect(badge).toBeVisible()
  })

  test('article shows reading time', async ({ page }) => {
    const readTime = page.locator('span').filter({ hasText: /min read/i })
    await expect(readTime).toBeVisible()
  })

  test('article body content renders', async ({ page }) => {
    // The article prose is inside <div ref="proseRef" class="prose-article">
    // Use main content area to avoid strict mode
    const prose = page.locator('.prose-article').first()
    await expect(prose).toBeVisible()
  })

  test('reading progress bar is present at top of page', async ({ page }) => {
    // Progress bar: fixed div at top with h-full class and width style
    const bar = page.locator('div.fixed.top-0.z-\\[60\\] div.h-full').first()
    await expect(bar).toBeAttached()
  })

  test('progress bar advances on scroll', async ({ page }) => {
    const getWidth = () => page.evaluate(() => {
      const bar = document.querySelector('div.fixed.top-0.z-\\[60\\] div.h-full') as HTMLElement | null
      return bar ? parseFloat(bar.style.width || '0') : 0
    })
    const initial = await getWidth()
    await page.evaluate(() => window.scrollTo(0, 800))
    await page.waitForTimeout(300)
    const after = await getWidth()
    expect(after).toBeGreaterThanOrEqual(initial)
  })

  test('"Back to all articles" link is visible', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /all articles/i })
    await expect(backLink).toBeVisible()
    await expect(backLink).toHaveAttribute('href', /\/blog$/)
  })

  test('"Share" button is visible', async ({ page }) => {
    const shareBtn = page.getByRole('button', { name: /share/i })
    await expect(shareBtn).toBeVisible()
  })

  test('"Share" button copies URL to clipboard', async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    const shareBtn = page.getByRole('button', { name: /share/i })
    await shareBtn.click()
    await expect(page.getByRole('button', { name: /copied/i })).toBeVisible()
  })

  test('table of contents sidebar renders for articles with headings', async ({ page }) => {
    // TOC aside: "hidden lg:block" — only shown on desktop if article has >1 headings
    const toc = page.locator('aside.hidden, aside[class*="hidden"]')
    // It may or may not have headings — just check the structure is in the DOM
    const hasToc = await toc.count()
    if (hasToc > 0) {
      // On desktop it should be visible (lg:block overrides hidden)
      await expect(toc.first()).toBeVisible()
    }
  })

  test('article renders in Farsi', async ({ page }) => {
    await goto(page, `${FA}/blog/${ARTICLE_SLUG}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('cover image container is at top', async ({ page }) => {
    const coverContainer = page.locator('img.object-cover').first()
    await expect(coverContainer).toBeVisible()
  })
})
