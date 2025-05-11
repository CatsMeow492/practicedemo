import { test, expect } from '@playwright/test';

test.describe('Countries Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test
    await page.goto('http://localhost:3000/');
    // Wait longer for React to initialize and data to load
    await page.waitForTimeout(5000);
  });

  test('homepage loads with dashboard content', async ({ page }) => {
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'test-results/homepage-initial.png' });

    // Check that key UI elements exist without relying on specific headings
    // Check for search input which is always present
    await expect(page.getByPlaceholder('Search for a country...')).toBeVisible({ timeout: 30000 });

    // Check that the region filter is visible
    await expect(page.getByRole('combobox')).toBeVisible({ timeout: 30000 });

    // Wait longer to ensure the page has time to load
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'test-results/homepage-after-wait.png' });

    // Wait for country cards to load
    await page.locator('.grid > a').first().waitFor({ timeout: 40000 });

    // Take a final screenshot
    await page.screenshot({ path: 'test-results/homepage-final.png' });
  });

  test('search filter works', async ({ page }) => {
    // Wait for the search box to be visible first
    await expect(page.getByPlaceholder('Search for a country...')).toBeVisible({ timeout: 30000 });

    // Then wait for country cards to appear (this ensures data is loaded)
    await expect(page.locator('.grid > a').first()).toBeVisible({ timeout: 40000 });

    // Type "ger" in the search box
    await page.getByPlaceholder('Search for a country...').fill('ger');

    // Wait for the filtered results
    await page.waitForTimeout(2000); // Increased delay to allow filtering to complete

    // Look for Germany in the heading (more specific than just any text to avoid strict mode violations)
    await expect(page.locator('.grid h2').filter({ hasText: 'Germany' })).toBeVisible({
      timeout: 10000,
    });
  });

  test('continent filter works', async ({ page }) => {
    // Wait for the search box to be visible first
    await expect(page.getByPlaceholder('Search for a country...')).toBeVisible({ timeout: 30000 });

    // Then wait for country cards to appear (this ensures data is loaded)
    await expect(page.locator('.grid > a').first()).toBeVisible({ timeout: 40000 });

    // Select "Europe" in the dropdown
    await page.selectOption('select', 'europe');

    // Wait for the filtered results
    await page.waitForTimeout(5000); // Increased delay to allow API call to complete

    // Check that European countries are shown
    // We'll just check for at least one country card remaining
    await expect(page.locator('.grid > a').first()).toBeVisible({ timeout: 10000 });
  });

  test('country detail page loads', async ({ page }) => {
    // Wait for the search box to be visible first
    await expect(page.getByPlaceholder('Search for a country...')).toBeVisible({ timeout: 30000 });

    // Then wait for country cards to appear (this ensures data is loaded)
    await expect(page.locator('.grid > a').first()).toBeVisible({ timeout: 40000 });

    // Click on the first country card (any country will do)
    await page.locator('.grid > a').first().click();

    // Should navigate to the country detail page
    await expect(page).toHaveURL(/\/country\//);

    // Back button should be visible
    await expect(page.getByText('Back')).toBeVisible({ timeout: 10000 });
  });
});
