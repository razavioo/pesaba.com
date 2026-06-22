import { test, expect } from '@playwright/test'

test.describe('Contact API', () => {
  // Nuxt app serves under /pesaba.com base URL
  const CONTACT_API_PATH = '/pesaba.com/api/contact'

  test('should accept valid contact form submission', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        name: 'Test Engineer',
        email: 'test@pesaba.com',
        company: 'Safety & Trust Inc',
        product: 'K200 Data Diode',
        message: 'This is a professional verification message from Playwright integration tests.'
      }
    })
    
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ ok: true })
  })

  test('should reject submission with missing required fields', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        company: 'No Name Corp',
        message: 'This should fail because name and email are missing.'
      }
    })
    
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.statusMessage).toContain('required')
  })

  test('should reject submission with invalid email format', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        name: 'Jane Doe',
        email: 'not-a-valid-email-address',
        message: 'This should fail due to invalid email.'
      }
    })
    
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.statusMessage).toContain('email')
  })
})

test.describe('Sitemap and Feed XML endpoints', () => {
  test('sitemap.xml should return valid XML with URL locations', async ({ request }) => {
    const response = await request.get('/pesaba.com/sitemap.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    
    const text = await response.text()
    expect(text).toContain('<?xml')
    expect(text).toContain('<urlset')
    expect(text).toContain('<loc>')
    expect(text).toContain('/en')
    expect(text).toContain('/fa')
  })

  test('feed.xml should return valid RSS feed XML', async ({ request }) => {
    const response = await request.get('/pesaba.com/feed.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    
    const text = await response.text()
    expect(text).toContain('<?xml')
    expect(text).toContain('<rss')
    expect(text).toContain('<channel>')
    expect(text).toContain('<title>')
  })
})
