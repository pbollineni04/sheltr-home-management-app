import { test, expect } from '@playwright/test';

// Headed setup that lets you sign in manually, then saves storage state.
// Run once: `npm run test:e2e` and this setup project will launch first.
// Steps in UI:
// 1) Sign in normally in the app window.
// 2) Wait until you land on an authenticated page (e.g., dashboard/expenses).
// 3) The test will detect Supabase auth token in localStorage and save storage state.

async function waitForSupabaseAuth(page: import('@playwright/test').Page, timeoutMs = 60_000) {
  const start = Date.now();
  // Poll localStorage for an sb-*-auth-token key which Supabase uses.
  while (Date.now() - start < timeoutMs) {
    const hasAuth = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        if (k.includes('sb-') && k.endsWith('-auth-token')) {
          try {
            const v = localStorage.getItem(k);
            if (v && JSON.parse(v)?.access_token) return true;
          } catch {}
        }
      }
      return false;
    });
    if (hasAuth) return true;
    await page.waitForTimeout(1000);
  }
  return false;
}

test('manual login and save storage state', async ({ page, context }) => {
  console.log('\n[Auth Setup] Opening app. Please sign in, then wait...');
  await page.goto('/');

  const ok = await waitForSupabaseAuth(page, 90_000);
  expect(ok).toBeTruthy();

  await context.storageState({ path: 'tests/.auth/storage.json' });
  console.log('[Auth Setup] Storage saved to tests/.auth/storage.json');
});
