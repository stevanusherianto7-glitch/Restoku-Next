import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/email/i).fill("admin@restoku.com");
  await page.getByLabel(/password/i).fill("password");
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("should display dashboard page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /dashboard partner/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display statistics cards", async ({ page }) => {
    await expect(page.getByText(/omset penjualan/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/total pesanan/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display sidebar navigation", async ({ page }) => {
    await expect(page.getByRole("navigation").first()).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to POS from dashboard", async ({ page }) => {
    await page.getByRole("link", { name: /kasir/i }).first().click();
    await page.waitForURL("**/pos", { timeout: 10000 });
    await expect(page).toHaveURL(/\/pos/);
  });

  test("should navigate to menu management", async ({ page }) => {
    await page.goto("/menu");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/menu/);
  });

  test("should display recent orders table", async ({ page }) => {
    await expect(page.getByText(/pesanan real-time/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display top selling menu", async ({ page }) => {
    await expect(page.getByText(/menu terlaris/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should logout from dashboard", async ({ page }) => {
    // Try logout title first, then fallback to button
    const logoutTitle = page.getByTitle(/logout/i).first();
    if (await logoutTitle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutTitle.click();
    } else {
      await page.getByRole("button", { name: /keluar|logout/i }).first().click();
    }
    await page.waitForURL("**/login", { timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
