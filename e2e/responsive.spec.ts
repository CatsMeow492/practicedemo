import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('layout adjusts properly on desktop', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 800 });

    // Go to the homepage
    await page.goto('http://localhost:3000/');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/desktop-layout.png' });

    // Check that the grid has multiple columns on desktop
    // This test assumes a CSS Grid or Flexbox layout
    const gridComputedStyle = await page.evaluate(() => {
      const grid = document.querySelector('.grid');
      if (!grid) return null;
      const style = window.getComputedStyle(grid);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
      };
    });

    // Verify grid has multiple columns
    expect(gridComputedStyle).not.toBeNull();
    if (gridComputedStyle?.display === 'grid') {
      // If using CSS Grid, verify it has multiple columns
      expect(gridComputedStyle.gridTemplateColumns.split(' ').length).toBeGreaterThan(1);
    }
  });

  test('layout adjusts properly on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    // Go to the homepage
    await page.goto('http://localhost:3000/');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/mobile-layout.png' });

    // Verify search and filter controls are visible and usable on mobile
    await expect(page.getByPlaceholder('Search for a country...')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();

    // Check that the grid has a single column on mobile
    // Or at least fewer columns than on desktop
    const gridComputedStyle = await page.evaluate(() => {
      const grid = document.querySelector('.grid');
      if (!grid) return null;
      const style = window.getComputedStyle(grid);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
      };
    });

    // Verify grid layout is appropriate for mobile
    expect(gridComputedStyle).not.toBeNull();
    if (gridComputedStyle?.display === 'grid') {
      // For mobile, we expect either 1 column or fewer columns than desktop
      const columnCount = gridComputedStyle.gridTemplateColumns.split(' ').length;
      expect(columnCount).toBeLessThanOrEqual(2); // Most mobile layouts will have 1-2 columns
    }
  });

  test('country detail page is responsive', async ({ page }) => {
    // Set viewport to mobile size first
    await page.setViewportSize({ width: 375, height: 667 });

    // Go to the homepage
    await page.goto('http://localhost:3000/');

    // Wait for countries to load
    await page.locator('.grid > a').first().waitFor({ timeout: 30000 });

    // Click on the first country to navigate to detail page
    await page.locator('.grid > a').first().click();

    // Should navigate to country detail page
    await expect(page).toHaveURL(/\/country\//);

    // Take a screenshot of mobile detail view
    await page.screenshot({ path: 'test-results/country-detail-mobile.png' });

    // Check key elements are visible on mobile
    await expect(page.getByText('Back')).toBeVisible();

    // Now resize to desktop
    await page.setViewportSize({ width: 1280, height: 800 });

    // Take a screenshot of desktop detail view
    await page.screenshot({ path: 'test-results/country-detail-desktop.png' });

    // Verify the same elements are still visible
    await expect(page.getByText('Back')).toBeVisible();
  });

  test('theme toggle works across viewport sizes', async ({ page }) => {
    // Test on desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000);

    // Toggle theme
    const themeToggle = page.getByRole('button', { name: /Activate (dark|light) mode/ });
    await themeToggle.click();

    // Take screenshot to verify theme change
    await page.screenshot({ path: 'test-results/theme-toggle-desktop.png' });

    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000);

    // Find theme toggle on mobile
    const mobileThemeToggle = page.getByRole('button', { name: /Activate (dark|light) mode/ });
    await expect(mobileThemeToggle).toBeVisible();

    // Toggle theme
    await mobileThemeToggle.click();

    // Take screenshot to verify theme change
    await page.screenshot({ path: 'test-results/theme-toggle-mobile.png' });
  });
});
