import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("should display dashboard page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("should display statistics cards", async ({ page }) => {
    await expect(page.getByText(/penjualan/i)).toBeVisible();
    await expect(page.getByText(/pesanan/i)).toBeVisible();
  });

  test("should display sidebar navigation", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/kasir/i)).toBeVisible();
  });

  test("should navigate to POS from dashboard", async ({ page }) => {
    await page.getByText(/kasir.*pos/i).first().click();
    await expect(page).toHaveURL("/pos");
  });

  test("should navigate to menu management", async ({ page }) => {
    await page.getByText(/produk.*menu/i).first().click();
    await expect(page).toHaveURL("/menu");
  });

  test("should display recent orders table", async ({ page }) => {
    await expect(page.getByText(/pesanan terbaru/i)).toBeVisible();
  });

  test("should display top selling menu", async ({ page }) => {
    await expect(page.getByText(/menu terlaris/i)).toBeVisible();
  });

  test("should logout from dashboard", async ({ page }) => {
    await page.getByTitle(/logout/i).first().click();
    await expect(page).toHaveURL("/login");
  });
});
