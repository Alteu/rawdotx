import { test, expect } from '@playwright/test';

// Baseline check: the storefront home page loads without server or JavaScript errors.
test('home page loads without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  const response = await page.goto('/');
  expect(response?.ok(), `HTTP ${response?.status()}`).toBe(true);
  expect(errors).toEqual([]);
  await expect(page.locator('body')).toBeVisible();
});
