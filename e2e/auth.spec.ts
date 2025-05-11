import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage before each test
    await page.goto('http://localhost:3000/');
    // Wait for the page to load
    await page.waitForTimeout(2000);
  });

  test('signin link is visible when not authenticated', async ({ page }) => {
    // Look for a sign-in button (changing from link to button)
    const signInButton = page.getByRole('button', { name: /sign in/i });

    // Verify it's visible
    await expect(signInButton).toBeVisible();
  });

  test('clicking signin navigates to auth page', async ({ page }) => {
    // Find and click the sign-in button (changing from link to button)
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await signInButton.click();

    // Should navigate to the auth page
    await expect(page).toHaveURL(/\/auth\/signin/);

    // Auth providers should be visible on the page
    const authProviders = page.getByRole('button', { name: /Continue with GitHub/i });
    await expect(authProviders).toBeVisible();
  });

  test('auth page has expected layout', async ({ page }) => {
    // Navigate directly to the auth page
    await page.goto('http://localhost:3000/auth/signin');

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/auth-page.png' });

    // Page should have appropriate title
    await expect(page.locator('h1, h2').filter({ hasText: /sign in|log in/i })).toBeVisible();

    // Authentication providers should be listed
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
  });

  test('auth page has responsive design', async ({ page }) => {
    // Test on desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/auth/signin');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/auth-page-desktop.png' });

    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/auth/signin');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: 'test-results/auth-page-mobile.png' });

    // Auth providers should still be visible on mobile
    await expect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
  });
});
