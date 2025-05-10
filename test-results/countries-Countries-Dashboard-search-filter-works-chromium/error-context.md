# Test info

- Name: Countries Dashboard >> search filter works
- Location: /Users/taylormohney/Documents/GitHub/practicedemo/e2e/countries.spec.ts:57:7

# Error details

```
Error: expect.toBeVisible: Error: strict mode violation: getByText('Germany') resolved to 2 elements:
    1) <span class="sr-only">Loading image: Flag of Germany</span> aka getByRole('link', { name: 'Flag of Germany Loading image' })
    2) <h2 class="text-xl font-bold text-primary mb-2">Germany</h2> aka getByRole('link', { name: 'Flag of Germany Loading image' })

Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for getByText('Germany')

    at /Users/taylormohney/Documents/GitHub/practicedemo/e2e/countries.spec.ts:68:45
```

# Page snapshot

```yaml
- paragraph: "React Query Status: success / idle"
- paragraph: "API Status: Success"
- paragraph: "Countries loaded: 250"
- banner:
  - heading "Countries Dashboard" [level=1]
  - button "Sign in"
- main:
  - heading "Countries Dashboard" [level=1]
  - textbox "Search for a country...": ger
  - combobox:
    - option "Filter by Region" [selected]
    - option "Africa"
    - option "Americas"
    - option "Asia"
    - option "Europe"
    - option "Oceania"
  - 'link "Flag of Nigeria Nigeria Population: 206,139,587 Region: Africa Capital: Abuja"':
    - /url: /country/ng
    - img "Flag of Nigeria"
    - heading "Nigeria" [level=2]
    - paragraph: "Population: 206,139,587"
    - paragraph: "Region: Africa"
    - paragraph: "Capital: Abuja"
  - 'link "Flag of Niger Loading image: Flag of Niger Niger Population: 24,206,636 Region: Africa Capital: Niamey"':
    - /url: /country/ne
    - img "Flag of Niger"
    - text: "Loading image: Flag of Niger"
    - heading "Niger" [level=2]
    - paragraph: "Population: 24,206,636"
    - paragraph: "Region: Africa"
    - paragraph: "Capital: Niamey"
  - 'link "Flag of Algeria Loading image: Flag of Algeria Algeria Population: 44,700,000 Region: Africa Capital: Algiers"':
    - /url: /country/dz
    - img "Flag of Algeria"
    - text: "Loading image: Flag of Algeria"
    - heading "Algeria" [level=2]
    - paragraph: "Population: 44,700,000"
    - paragraph: "Region: Africa"
    - paragraph: "Capital: Algiers"
  - 'link "Flag of Germany Loading image: Flag of Germany Germany Population: 83,240,525 Region: Europe Capital: Berlin"':
    - /url: /country/de
    - img "Flag of Germany"
    - text: "Loading image: Flag of Germany"
    - heading "Germany" [level=2]
    - paragraph: "Population: 83,240,525"
    - paragraph: "Region: Europe"
    - paragraph: "Capital: Berlin"
- contentinfo:
  - paragraph: © 2025 Countries Dashboard
  - paragraph:
    - text: Data provided by
    - link "REST Countries API":
      - /url: https://restcountries.com/
- button "Open Tanstack query devtools":
  - img
- alert: Countries Dashboard
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Countries Dashboard', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Go to the starting url before each test
   6 |     await page.goto('http://localhost:3000/');
   7 |     // Wait a bit for React to initialize
   8 |     await page.waitForTimeout(1000);
   9 |   });
  10 |
  11 |   test('homepage loads with debug info', async ({ page }) => {
  12 |     // Take a screenshot to see what's happening
  13 |     await page.screenshot({ path: 'test-results/homepage-initial.png' });
  14 |
  15 |     // Check that the title is visible - using a more specific selector to handle multiple headings
  16 |     await expect(page.locator('main h1').filter({ hasText: 'Countries Dashboard' })).toBeVisible();
  17 |
  18 |     // Check that the search input is visible
  19 |     await expect(page.getByPlaceholder('Search for a country...')).toBeVisible();
  20 |
  21 |     // Check that the region filter is visible
  22 |     await expect(page.getByRole('combobox')).toBeVisible();
  23 |
  24 |     // Wait longer to ensure the page has time to load
  25 |     await page.waitForTimeout(10000);
  26 |     await page.screenshot({ path: 'test-results/homepage-after-wait.png' });
  27 |
  28 |     // Try to locate the debug box by its yellow background color
  29 |     const debugBox = page.locator('.bg-yellow-100');
  30 |     await expect(debugBox)
  31 |       .toBeVisible({ timeout: 5000 })
  32 |       .catch(async () => {
  33 |         // If debug box isn't visible, log the page content to help debug
  34 |         const content = await page.content();
  35 |         console.log('Page content:', content);
  36 |       });
  37 |
  38 |     // Check that we have the debug info showing React Query's status
  39 |     await expect(page.getByText('React Query Status:')).toBeVisible({ timeout: 10000 });
  40 |
  41 |     // Just verify that API Status exists and reports something (don't care what for now)
  42 |     await expect(page.getByText('API Status:')).toBeVisible({ timeout: 5000 });
  43 |
  44 |     // Log the API and React Query status for debugging
  45 |     const apiStatusText = await page.getByText('API Status:').textContent();
  46 |     const rqStatusText = await page.getByText('React Query Status:').textContent();
  47 |     const countriesLoadedText = await page.getByText('Countries loaded:').textContent();
  48 |
  49 |     console.log('API Status Text:', apiStatusText);
  50 |     console.log('React Query Status Text:', rqStatusText);
  51 |     console.log('Countries Loaded Text:', countriesLoadedText);
  52 |
  53 |     // Take a final screenshot
  54 |     await page.screenshot({ path: 'test-results/homepage-final.png' });
  55 |   });
  56 |
  57 |   test('search filter works', async ({ page }) => {
  58 |     // Wait for API to load successfully
  59 |     await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 30000 });
  60 |
  61 |     // Type "ger" in the search box
  62 |     await page.getByPlaceholder('Search for a country...').fill('ger');
  63 |
  64 |     // Wait for the filtered results
  65 |     await page.waitForTimeout(500); // Small delay to allow filtering to complete
  66 |
  67 |     // Germany should be visible
> 68 |     await expect(page.getByText('Germany')).toBeVisible({ timeout: 10000 });
     |                                             ^ Error: expect.toBeVisible: Error: strict mode violation: getByText('Germany') resolved to 2 elements:
  69 |   });
  70 |
  71 |   test('continent filter works', async ({ page }) => {
  72 |     // Wait for API to load successfully
  73 |     await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 30000 });
  74 |
  75 |     // Select "Europe" in the dropdown
  76 |     await page.selectOption('select', 'europe');
  77 |
  78 |     // Wait for the filtered results
  79 |     await page.waitForTimeout(2000); // Small delay to allow API call to complete
  80 |
  81 |     // Check that the API status changes back to Success after filtering
  82 |     await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 10000 });
  83 |   });
  84 |
  85 |   test('country detail page loads', async ({ page }) => {
  86 |     // Wait for API to load successfully
  87 |     await expect(page.getByText('API Status: Success')).toBeVisible({ timeout: 30000 });
  88 |
  89 |     // Click on the first country card (any country will do)
  90 |     await page.locator('.grid > a').first().click();
  91 |
  92 |     // Should navigate to the country detail page
  93 |     await expect(page).toHaveURL(/\/country\//);
  94 |
  95 |     // Back button should be visible
  96 |     await expect(page.getByText('Back')).toBeVisible();
  97 |   });
  98 | });
  99 |
```