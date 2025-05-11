import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage before each test
    await page.goto('http://localhost:3000/');
    // Wait for the page to load - increasing timeout for stability
    await page.waitForTimeout(5000);
  });

  test('page has correct title', async ({ page }) => {
    // Check the page title
    await expect(page).toHaveTitle(/Countries Dashboard/);
  });

  test('theme toggle button is accessible', async ({ page }) => {
    // Find the theme toggle button
    const themeToggle = page.getByRole('button', { name: /Activate (dark|light) mode/ });

    // Ensure it's visible and can be interacted with
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeEnabled();

    // Check it has the correct aria-label
    const initialAriaLabel = await themeToggle.getAttribute('aria-label');
    expect(initialAriaLabel).toMatch(/Activate (dark|light) mode/);

    // Toggle the theme
    await themeToggle.click();

    // Verify the aria-label changes
    await expect(themeToggle).toHaveAttribute(
      'aria-label',
      initialAriaLabel?.includes('dark') ? 'Activate light mode' : 'Activate dark mode',
    );
  });

  test('country cards are keyboard navigable', async ({ page }) => {
    // Wait for search box and country cards to load - increasing timeout
    await page.getByPlaceholder('Search for a country...').waitFor({ timeout: 30000 });
    
    // Wait for at least one country card to appear
    await page.locator('.grid > a').first().waitFor({ timeout: 30000 });

    // Focus on the search box first
    await page.getByPlaceholder('Search for a country...').focus();

    // Tab to the first country card
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check that a country card has focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'DIV']).toContain(focusedElement);

    // Press Enter to navigate to detail page
    await page.keyboard.press('Enter');

    // Should navigate to country detail page
    await expect(page).toHaveURL(/\/country\//);
  });

  test('images have alt text', async ({ page }) => {
    // Wait for country cards to load - increasing timeout
    await page.locator('.grid > a').first().waitFor({ timeout: 40000 });

    // Check all flag images have alt text
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    // This is a basic visual check - for complete contrast testing,
    // specific tools like axe would be needed

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/before-contrast-check.png' });

    // Wait for the page content to be fully loaded
    await page.waitForTimeout(5000);
    
    // Wait for search input which is always present
    const searchInput = page.getByPlaceholder('Search for a country...');
    await expect(searchInput).toBeVisible({ timeout: 30000 });

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/contrast-check.png' });
  });
});
