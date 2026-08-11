import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3111',
    launchOptions: { executablePath: '/usr/bin/google-chrome-stable' },
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
})
