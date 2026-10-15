import { defineConfig, devices } from '@playwright/test';

// Tests run against a running `shopify theme dev` server (start it with `npm run dev`).
// It needs store credentials, so Playwright does not start it automatically.
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:9292';

// Cloud sessions ship a pre-installed Chromium; the SessionStart hook exports its path.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: { executablePath },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
