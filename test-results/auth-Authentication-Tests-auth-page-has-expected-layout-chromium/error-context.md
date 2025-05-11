# Test info

- Name: Authentication Tests >> auth page has expected layout
- Location: /Users/taylormohney/Documents/GitHub/practicedemo/e2e/auth.spec.ts:32:7

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()

Locator: locator('.auth-provider')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('.auth-provider')

    at /Users/taylormohney/Documents/GitHub/practicedemo/e2e/auth.spec.ts:43:50
```

# Page snapshot

```yaml
- paragraph: "React Query Status: success / idle"
- paragraph: "API Status: Success"
- paragraph: "Countries loaded: 250"
- banner:
  - heading "Where in the world?" [level=1]
  - text: "Animation Variant: test"
  - button "Activate dark mode": Dark Mode
  - button "Sign in"
- main:
  - heading "Sign In" [level=1]
  - paragraph: Access your Countries Dashboard account
  - button "Continue with GitHub":
    - img
    - text: Continue with GitHub
  - text: Or with credentials Username
  - textbox "Username"
  - paragraph: "(Hint: use \"demo\")"
  - text: Password
  - textbox "Password"
  - paragraph: "(Hint: use \"demo\")"
  - button "Sign In"
  - link "Back to Home":
    - /url: /
- contentinfo:
  - paragraph: © 2025 Where in the world?
  - paragraph:
    - text: Data provided by
    - link "REST Countries API":
      - /url: https://restcountries.com/
- button "Open Tanstack query devtools":
  - img
- alert: Where in the world?
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Authentication Tests', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Go to the homepage before each test
   6 |     await page.goto('http://localhost:3000/');
   7 |     // Wait for the page to load
   8 |     await page.waitForTimeout(2000);
   9 |   });
  10 |
  11 |   test('signin link is visible when not authenticated', async ({ page }) => {
  12 |     // Look for a sign-in link (it might have different text depending on your UI)
  13 |     const signInLink = page.getByRole('link', { name: /sign in/i });
  14 |
  15 |     // Verify it's visible
  16 |     await expect(signInLink).toBeVisible();
  17 |   });
  18 |
  19 |   test('clicking signin navigates to auth page', async ({ page }) => {
  20 |     // Find and click the sign-in link
  21 |     const signInLink = page.getByRole('link', { name: /sign in/i });
  22 |     await signInLink.click();
  23 |
  24 |     // Should navigate to the auth page
  25 |     await expect(page).toHaveURL(/\/auth\/signin/);
  26 |
  27 |     // Auth providers should be visible on the page
  28 |     const authProviders = page.locator('.auth-provider');
  29 |     await expect(authProviders).toBeVisible();
  30 |   });
  31 |
  32 |   test('auth page has expected layout', async ({ page }) => {
  33 |     // Navigate directly to the auth page
  34 |     await page.goto('http://localhost:3000/auth/signin');
  35 |
  36 |     // Take a screenshot for visual verification
  37 |     await page.screenshot({ path: 'test-results/auth-page.png' });
  38 |
  39 |     // Page should have appropriate title
  40 |     await expect(page.locator('h1, h2').filter({ hasText: /sign in|log in/i })).toBeVisible();
  41 |
  42 |     // Authentication providers should be listed
> 43 |     await expect(page.locator('.auth-provider')).toBeVisible();
     |                                                  ^ Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
  44 |   });
  45 |
  46 |   test('auth page has responsive design', async ({ page }) => {
  47 |     // Test on desktop
  48 |     await page.setViewportSize({ width: 1280, height: 800 });
  49 |     await page.goto('http://localhost:3000/auth/signin');
  50 |     await page.waitForTimeout(1000);
  51 |
  52 |     // Take screenshot
  53 |     await page.screenshot({ path: 'test-results/auth-page-desktop.png' });
  54 |
  55 |     // Test on mobile
  56 |     await page.setViewportSize({ width: 375, height: 667 });
  57 |     await page.goto('http://localhost:3000/auth/signin');
  58 |     await page.waitForTimeout(1000);
  59 |
  60 |     // Take screenshot
  61 |     await page.screenshot({ path: 'test-results/auth-page-mobile.png' });
  62 |
  63 |     // Auth providers should still be visible on mobile
  64 |     await expect(page.locator('.auth-provider')).toBeVisible();
  65 |   });
  66 | });
  67 |
```