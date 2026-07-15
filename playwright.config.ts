import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER ? undefined : [
    {
      command: 'bash scripts/start-cms-e2e.sh',
      url: 'http://localhost:4400/api/v1/public/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'NUXT_IGNORE_LOCK=1 NUXT_PUBLIC_CMS_API_URL=http://localhost:4400/api/v1 NUXT_PUBLIC_SITE_URL=https://pesaba.com NUXT_PUBLIC_SITE_INDEXABLE=true NUXT_CONTACT_RATE_LIMIT_MAX=100 npm run dev',
      url: 'http://localhost:3000/fa',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],

  projects: [
    {
      name: 'chromium-en',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        storageState: undefined,
      },
    },
    {
      name: 'chromium-fa',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'fa-IR',
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        locale: 'en-US',
      },
    },
  ],
})
