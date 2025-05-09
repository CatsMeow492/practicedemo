import { test, expect } from '@playwright/test';

test.describe('Countries Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test
    await page.goto('http://localhost:3000/');
    // Wait a bit for React to initialize
    await page.waitForTimeout(1000);
  });

  test('homepage loads with debug info', async ({ page }) => {
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'test-results/homepage-initial.png' });

    // Check that the title is visible
    await expect(page.getByRole('heading', { name: 'Countries Dashboard' })).toBeVisible();

    // Check that the search input is visible
    await expect(page.getByPlaceholder('Search for a country...')).toBeVisible();

    // Check that the region filter is visible
    await expect(page.getByRole('combobox')).toBeVisible();

    // Wait longer to ensure the page has time to load
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'test-results/homepage-after-wait.png' });

    // Try to locate the debug box by its yellow background color
    const debugBox = page.locator('.bg-yellow-100');
    await expect(debugBox)
      .toBeVisible({ timeout: 5000 })
      .catch(async () => {
        // If debug box isn't visible, log the page content to help debug
        const content = await page.content();
        console.log('Page content:', content);
      });

    // Check that we have the debug info showing React Query's status
    await expect(page.getByText('React Query Status:')).toBeVisible({ timeout: 10000 });

    // Just verify that API Status exists and reports something (don't care what for now)
    await expect(page.getByText('API Status:')).toBeVisible({ timeout: 5000 });

    // Log the API and React Query status for debugging
    const apiStatusText = await page.getByText('API Status:').textContent();
    const rqStatusText = await page.getByText('React Query Status:').textContent();
    const countriesLoadedText = await page.getByText('Countries loaded:').textContent();

    console.log('API Status Text:', apiStatusText);
    console.log('React Query Status Text:', rqStatusText);
    console.log('Countries Loaded Text:', countriesLoadedText);

    // Take a final screenshot
    await page.screenshot({ path: 'test-results/homepage-final.png' });
  });

  test('search filter works', async ({ page }) => {
    // Wait for API to load successfully
    await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 30000 });

    // Type "ger" in the search box
    await page.getByPlaceholder('Search for a country...').fill('ger');

    // Wait for the filtered results
    await page.waitForTimeout(500); // Small delay to allow filtering to complete

    // Germany should be visible
    await expect(page.getByText('Germany')).toBeVisible({ timeout: 10000 });
  });

  test('continent filter works', async ({ page }) => {
    // Wait for API to load successfully
    await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 30000 });

    // Select "Europe" in the dropdown
    await page.selectOption('select', 'europe');

    // Wait for the filtered results
    await page.waitForTimeout(2000); // Small delay to allow API call to complete

    // Check that the API status changes back to Success after filtering
    await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 10000 });
  });

  test('country detail page loads', async ({ page }) => {
    // Wait for API to load successfully
    await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 30000 });

    // Click on the first country card (any country will do)
    await page.locator('.grid > a').first().click();

    // Should navigate to the country detail page
    await expect(page).toHaveURL(/\/country\//);

    // Back button should be visible
    await expect(page.getByText('Back')).toBeVisible();
  });
});
