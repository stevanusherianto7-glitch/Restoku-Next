import { test, expect } from "@playwright/test";

test.describe("Menu Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page).toHaveURL("/dashboard");
    await page.goto("/menu");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display menu catalog page", async ({ page }) => {
    await expect(page.getByText(/katalog hidangan/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /tambah menu baru/i })).toBeVisible();
  });

  test("should display category filter tabs", async ({ page }) => {
    await expect(page.getByRole("button", { name: /semua/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /makanan/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /minuman/i })).toBeVisible();
  });

  test("should search menu items", async ({ page }) => {
    await page.getByPlaceholder(/cari/i).fill("nasi");
    await page.getByRole("button", { name: /cari/i }).click();
  });

  test("should filter menu by category", async ({ page }) => {
    await page.getByRole("button", { name: /makanan/i }).click();
    await expect(page.getByRole("button", { name: /makanan/i })).toBeVisible();
  });
});
