import { expect, test } from '@playwright/test'

test.describe('Legacy redirects', () => {
  const cases = [
    {
      source: '/en/products/Data%20Diode%20A100',
      target: '/en/products/data-diodes/a100',
    },
    {
      source: '/fa/contact-us',
      target: '/fa/company/contact',
    },
    {
      source: '/en/articles/What%2520is%2520AES%2520algorithm%253F',
      target: '/en/blog/what-is-aes-algorithm',
    },
  ]

  for (const { source, target } of cases) {
    test(`${source} redirects to its canonical replacement`, async ({ request }) => {
      const response = await request.get(source, { maxRedirects: 0 })
      expect(response.status()).toBe(301)
      expect(response.headers().location).toBe(target)
    })
  }
})
