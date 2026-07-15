import { test, expect } from '@playwright/test'

test.describe('Contact API', () => {
  const CONTACT_API_PATH = '/api/contact'

  test('should accept valid contact form submission', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        name: 'Test Engineer',
        email: 'test@pesaba.com',
        company: 'Safety & Trust Inc',
        product: 'K200 Data Diode',
        message: 'This is a professional verification message from Playwright integration tests.',
        department: 'support',
        consent: true,
      }
    })
    
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.ok).toBe(true)
    expect(body.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(response.headers()['x-request-id']).toMatch(/^[0-9a-f-]{36}$/)
    expect(response.headers()['cache-control']).toContain('no-store')
  })

  test('should reject submission with missing required fields', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        company: 'No Name Corp',
        message: 'This should fail because name and email are missing.',
        consent: true,
      }
    })
    
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.statusMessage.toLowerCase()).toContain('name')
  })

  test('should reject submission with invalid email format', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        name: 'Jane Doe',
        email: 'not-a-valid-email-address',
        message: 'This should fail due to invalid email.',
        consent: true,
      }
    })
    
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.statusMessage.toLowerCase()).toContain('email')
  })

  test('should require explicit privacy consent', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        name: 'Test Engineer',
        email: 'engineer@example.com',
        message: 'A valid length message without privacy consent.',
      },
    })

    expect(response.status()).toBe(400)
    expect((await response.json()).statusMessage.toLowerCase()).toContain('consent')
  })

  test('should reject unsupported content types', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      headers: { 'content-type': 'text/plain' },
      data: 'not-json',
    })
    expect(response.status()).toBe(415)
  })

  test('should reject cross-origin browser submissions', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      headers: {
        origin: 'https://attacker.example',
        'sec-fetch-site': 'cross-site',
      },
      data: {
        name: 'Test Engineer',
        email: 'engineer@example.com',
        message: 'A valid message sent from an untrusted origin.',
        consent: true,
      },
    })
    expect(response.status()).toBe(403)
  })

  test('should reject oversized request bodies', async ({ request }) => {
    const response = await request.post(CONTACT_API_PATH, {
      data: {
        name: 'Test Engineer',
        email: 'engineer@example.com',
        message: 'x'.repeat(17_000),
        consent: true,
      },
    })
    expect(response.status()).toBe(413)
  })
})

test.describe('Public server endpoints', () => {
  test('health endpoint should be available and uncached', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(response.headers()['cache-control']).toContain('no-store')
  })

  test('sitemap.xml should return valid XML with URL locations', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
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
    const response = await request.get('/feed.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    
    const text = await response.text()
    expect(text).toContain('<?xml')
    expect(text).toContain('<rss')
    expect(text).toContain('<channel>')
    expect(text).toContain('<title>')
  })

  test('public CMS API exposes reviewed public product records', async ({ request }) => {
    const response = await request.get('http://localhost:4400/api/v1/public/content/product?locale=en')
    expect(response.status()).toBe(200)
    const documents = await response.json()
    const product = documents.find((item: { slug?: string }) => item.slug === 'a10')
    expect(product).toBeTruthy()
    expect(product.translation.description).toContain('require model and revision confirmation')
    expect(JSON.stringify(product)).not.toContain('physically impossible')
  })
})
