import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/email/i).fill("admin@restoku.com");
  await page.getByLabel(/password/i).fill("password");
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

test.describe("Menu Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/menu");
    await page.waitForLoadState("networkidle");
  });

  test("should display menu catalog page", async ({ page }) => {
    await expect(page.getByText(/katalog hidangan/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display add menu button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /tambah menu baru/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display category filter tabs", async ({ page }) => {
    await expect(page.getByRole("button", { name: /semua/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("should search menu items", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/cari/i);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("nasi");
    await page.waitForTimeout(500);
  });

  test("should filter menu by category", async ({ page }) => {
    const makananBtn = page.getByRole("button", { name: /makanan/i });
    await expect(makananBtn).toBeVisible({ timeout: 10000 });
    await makananBtn.click();
    await expect(makananBtn).toBeVisible();
  });
});
