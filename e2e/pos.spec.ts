import { test, expect, type Page } from "@playwright/test";

/**
 * Shared login helper — navigates to /login, fills credentials,
 * clicks submit, and waits for redirect to /dashboard.
 */
async function login(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/email/i).fill("admin@restoku.com");
  await page.getByLabel(/password/i).fill("password");
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

test.describe("POS (Point of Sale)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/pos");
    await page.waitForLoadState("networkidle");
  });

  test("should display POS page", async ({ page }) => {
    // Verify the page title or header text is present
    await expect(page.getByText(/pos kasir/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display cart panel", async ({ page }) => {
    // The receipt / cart panel should always be visible
    await expect(page.getByText(/struk pesanan/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display menu items", async ({ page }) => {
    // Wait for menu data to load — look for any menu card element on the page
    // The menu items are rendered as h3 elements inside the card grid
    const menuGrid = page.locator(".grid");
    await expect(menuGrid.first()).toBeVisible({ timeout: 10000 });

    // Check that at least one menu item card exists
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10000 });
  });

  test("should display category filter tabs", async ({ page }) => {
    // The "Semua Menu" button should always exist
    await expect(page.getByText(/semua menu/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should search menu items", async ({ page }) => {
    // Wait for the search input to be visible
    const searchInput = page.getByPlaceholder(/cari/i);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("nasi");
    // After filtering, verify the grid still has results or is empty
    await page.waitForTimeout(500); // debounce
  });

  test("should add item to cart", async ({ page }) => {
    // Wait for the menu grid to load
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10000 });

    // Click the first menu card to add to cart
    await menuCards.first().click();

    // The cart item count badge should update
    await expect(page.getByText(/1 item/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should enable checkout button when cart has items", async ({ page }) => {
    // Wait for the menu grid to load and click first item
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10000 });
    await menuCards.first().click();

    // The checkout button should be enabled
    const checkoutBtn = page.getByRole("button", { name: /proses pembayaran/i });
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await expect(checkoutBtn).toBeEnabled();
  });
});
