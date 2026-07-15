import { expect, request as playwrightRequest, test, type APIRequestContext } from '@playwright/test'

const CMS_URL = process.env.CMS_TEST_URL || 'http://localhost:4400/api/v1/'
const OWNER_EMAIL = 'owner@pesaba.local'
const OWNER_PASSWORD = 'PesabaLocalOwner-2026'

async function login(api: APIRequestContext, email: string, password: string) {
  const response = await api.post('auth/login', { data: { email, password } })
  expect(response.status()).toBe(201)
  const state = await api.storageState()
  const csrf = state.cookies.find((cookie: { name: string }) => cookie.name === 'pesaba_admin_csrf')?.value
  expect(csrf).toBeTruthy()
  return { 'x-csrf-token': csrf! }
}

test.describe('CMS administration API', () => {
  test('enforces owner user controls, revokes disabled sessions, and records the change', async ({ request: _request }, testInfo) => {
    const owner = await playwrightRequest.newContext({ baseURL: CMS_URL })
    const ownerHeaders = await login(owner, OWNER_EMAIL, OWNER_PASSWORD)
    const suffix = `${testInfo.project.name}-${Date.now()}`.replace(/[^a-z0-9]/gi, '').toLowerCase()
    const email = `viewer-${suffix}@example.test`
    const password = 'ViewerPassword-2026'

    const createdResponse = await owner.post('admin/users', {
      headers: ownerHeaders,
      data: { email, displayName: 'E2E Viewer', password, role: 'VIEWER' },
    })
    expect(createdResponse.status()).toBe(201)
    const created = await createdResponse.json()

    const viewer = await playwrightRequest.newContext({ baseURL: CMS_URL })
    const viewerHeaders = await login(viewer, email, password)
    const denied = await viewer.post('admin/redirects', {
      headers: viewerHeaders,
      data: { fromPath: `/viewer-${suffix}`, toPath: '/en' },
    })
    expect(denied.status()).toBe(403)

    const disabled = await owner.patch(`admin/users/${created.id}`, {
      headers: ownerHeaders,
      data: { active: false },
    })
    expect(disabled.status()).toBe(200)
    expect((await disabled.json()).active).toBe(false)

    expect((await viewer.get('auth/session')).status()).toBe(401)
    const audit = await owner.get('admin/audit?entityType=user&limit=100')
    expect(audit.status()).toBe(200)
    const events = await audit.json()
    expect(events.some((event: { action: string; entityId: string }) => event.action === 'user.update' && event.entityId === created.id)).toBeTruthy()

    const lastOwner = await owner.patch(`admin/users/${(await (await owner.get('auth/session')).json()).user.id}`, {
      headers: ownerHeaders,
      data: { role: 'EDITOR' },
    })
    expect(lastOwner.status()).toBe(409)
    await viewer.dispose()
    await owner.dispose()
  })

  test('exposes active panel redirects to the public runtime lookup', async ({ request }, testInfo) => {
    const owner = await playwrightRequest.newContext({ baseURL: CMS_URL })
    const ownerHeaders = await login(owner, OWNER_EMAIL, OWNER_PASSWORD)
    const source = `/cms-redirect-${`${testInfo.project.name}-${Date.now()}`.replace(/[^a-z0-9]/gi, '').toLowerCase()}`
    const saved = await owner.post('admin/redirects', {
      headers: ownerHeaders,
      data: { fromPath: source, toPath: '/en/company/contact', statusCode: 302, active: true },
    })
    expect(saved.status()).toBe(201)

    const lookup = await owner.get(`public/redirect?path=${encodeURIComponent(source)}`)
    expect(lookup.status()).toBe(200)
    expect(await lookup.json()).toMatchObject({ fromPath: source, toPath: '/en/company/contact', statusCode: 302, active: true })

    const publicResponse = await request.get(source, { maxRedirects: 0 })
    expect(publicResponse.status()).toBe(302)
    expect(publicResponse.headers().location).toBe('/en/company/contact')
    await owner.dispose()
  })
})
