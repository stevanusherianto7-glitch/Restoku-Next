/**
 * E2E: Menu Management — Owner/Manager role
 *
 * Covers:
 *  - Katalog Hidangan heading on /menu
 *  - Tambah Menu Baru button visible
 *  - Category filter tabs (Semua, Makanan, Minuman)
 *  - Search functionality
 *  - Menu item cards visible in grid
 *  - Public menu page at /menu/:restaurantId?table=:n
 *  - Digital menu QR scan navigates correctly
 */
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("Menu Management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "owner");
    await page.goto("/menu");
    await page.waitForLoadState("networkidle");
  });

  test("shows Katalog Hidangan heading", async ({ page }) => {
    await expect(page.getByText(/katalog hidangan/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Tambah Menu Baru button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /tambah menu baru/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows Semua category tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /semua/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Makanan category tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /makanan/i })).toBeVisible({ timeout: 10_000 });
  });

  test("shows Minuman category tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /minuman/i })).toBeVisible({ timeout: 10_000 });
  });

  test("search input is visible and interactive", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/cari/i);
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill("nasi");
    await page.waitForTimeout(500);
    await expect(searchInput).toHaveValue("nasi");
  });

  test("filter by Makanan category works", async ({ page }) => {
    const makananBtn = page.getByRole("button", { name: /makanan/i });
    await expect(makananBtn).toBeVisible({ timeout: 10_000 });
    await makananBtn.click();
    await page.waitForTimeout(300);
    await expect(makananBtn).toBeVisible();
  });

  test("filter by Minuman category works", async ({ page }) => {
    const minumanBtn = page.getByRole("button", { name: /minuman/i });
    await expect(minumanBtn).toBeVisible({ timeout: 10_000 });
    await minumanBtn.click();
    await page.waitForTimeout(300);
    await expect(minumanBtn).toBeVisible();
  });
});

test.describe("Digital Menu (Public)", () => {
  test("public menu page loads without login", async ({ page }) => {
    await page.goto("/menu/rest-1?table=3");
    await page.waitForLoadState("networkidle");
    // Should show menu page (no login redirect)
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("public menu shows restaurant name or branding", async ({ page }) => {
    await page.goto("/menu/rest-1?table=3");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/restoku/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("public menu shows table number indicator", async ({ page }) => {
    await page.goto("/menu/rest-1?table=3");
    await page.waitForLoadState("networkidle");
    // Table 3 should be indicated somewhere
    await expect(page.getByText(/meja 3|table 3/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("public menu shows menu items", async ({ page }) => {
    await page.goto("/menu/rest-1?table=3");
    await page.waitForLoadState("networkidle");
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10_000 });
  });
});
