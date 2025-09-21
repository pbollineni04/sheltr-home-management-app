import { test, expect } from '@playwright/test';

// Basic smoke test to ensure the built app serves and renders
// The webServer in playwright.config.ts builds and serves on port 4173

test.describe('App smoke', () => {
  test('loads home page', async ({ page }) => {
    await page.goto('/');

    // Title from index.html
    await expect(page).toHaveTitle(/sheltr/i);

    // The app root should exist
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });
});
