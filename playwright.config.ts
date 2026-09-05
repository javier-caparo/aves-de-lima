import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration.
 * Requires a production build before starting the web server:
 *   npm run build
 * https://nextjs.org/docs/app/building-your-application/testing/playwright
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  use: {
    // Constitution Article I: Desktop 1440px is the reference viewport.
    baseURL: 'http://localhost:3000',
    viewport: { width: 1440, height: 900 },
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        // Use the locally installed Chrome instead of the downloaded
        // Chromium bundle (managed environment blocks the binary CDN).
        channel: 'chrome',
      },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
