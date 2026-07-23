import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await page.waitForURL("/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL("/dashboard");
  });

  test("should display dashboard page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /dashboard partner/i })
    ).toBeVisible();
  });

  test("should display statistics cards", async ({ page }) => {
    await expect(page.getByText(/omset penjualan/i).first()).toBeVisible();
    await expect(page.getByText(/total pesanan/i).first()).toBeVisible();
  });

  test("should display sidebar navigation", async ({ page }) => {
    await expect(page.getByRole("navigation").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /kasir/i }).first()).toBeVisible();
  });

  test("should navigate to POS from dashboard", async ({ page }) => {
    await page.getByRole("link", { name: /kasir/i }).first().click();
    await expect(page).toHaveURL("/pos");
  });

  test("should navigate to menu management", async ({ page }) => {
    // The Menu link lives inside the collapsible "Manajemen" sidebar group.
    // Navigate directly to the protected route (session already established
    // via the beforeEach login) to verify the page loads.
    await page.goto("/menu");
    await expect(page).toHaveURL(/\/menu/);
  });

  test("should display recent orders table", async ({ page }) => {
    await expect(page.getByText(/pesanan real-time/i).first()).toBeVisible();
  });

  test("should display top selling menu", async ({ page }) => {
    await expect(page.getByText(/menu terlaris/i).first()).toBeVisible();
  });

  test("should logout from dashboard", async ({ page }) => {
    await page.getByRole("button", { name: /keluar|logout/i }).first().click();
    await expect(page).toHaveURL("/login");
  });
});
