import { test, expect } from '@playwright/test';

// This test navigates to the app and tries to use the Plaid "Connect Bank" button.
// It captures the network call to the edge function and surfaces the status code
// so we can debug 401/403 vs 500 quickly.

test.describe('Plaid connect flow (link token)', () => {
  test('clicking Connect Bank triggers edge function and reports status', async ({ page }) => {
    await page.goto('/');

    // Try to navigate to the Expenses page by looking for the header text.
    // If your app uses explicit nav, you can replace this with clicking the nav link.
    // Fallback: just search for the button on the page.

    // Find the Connect Bank button anywhere on the page.
    const connectButton = page.getByRole('button', { name: /connect bank/i });

    // Prepare to wait for the edge function response
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes('/functions/v1/plaid-create-link-token')
    );

    // Click the button (if it exists on current route)
    if (await connectButton.isVisible().catch(() => false)) {
      await connectButton.click();
    } else {
      // If button is not visible on the landing page, try common route for expenses
      await page.goto('/expenses');
      await expect(page.getByText(/expense tracker/i)).toBeVisible({ timeout: 10_000 });
      await page.getByRole('button', { name: /connect bank/i }).click();
    }

    const resp = await responsePromise;
    // Log status to the test output for quick triage
    const status = resp.status();
    console.log('[plaid-create-link-token] status =', status);
    const body = await resp.json().catch(() => null);
    console.log('[plaid-create-link-token] body =', body);

    if (status === 401) {
      console.warn('[hint] 401 Unauthorized. Run the setup project to save auth storage:');
      console.warn('  npx playwright test tests/e2e/auth.setup.spec.ts --project=setup');
    }

    // At minimum the request should reach the function successfully
    expect(resp.ok()).toBeTruthy();
  });
});
