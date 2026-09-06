import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',
  timeout: 60_000,
  workers: 1,
  use: {
    browserName: 'chromium',
    baseURL: `http://127.0.0.1:${process.env.SWI_PREVIEW_PORT || 4173}`,
    viewport: { width: 1440, height: 1100 },
    trace: 'retain-on-failure',
  },
})
