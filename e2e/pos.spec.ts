import { test, expect } from "@playwright/test";

test.describe("POS (Point of Sale)", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page).toHaveURL("/dashboard");
    await page.goto("/pos");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display POS page", async ({ page }) => {
    await expect(page.getByText(/pos kasir/i)).toBeVisible();
    await expect(page.getByText(/struk pesanan/i)).toBeVisible();
  });

  test("should display menu items", async ({ page }) => {
    const item = page.getByText(/nasi goreng/i).first();
    await item.scrollIntoViewIfNeeded();
    await expect(item).toBeVisible();
  });

  test("should filter by category", async ({ page }) => {
    const makananBtn = page.getByRole("button", { name: /makanan/i }).first();
    if (await makananBtn.isVisible()) {
      await makananBtn.click();
      const item = page.getByText(/nasi goreng/i).first();
      await item.scrollIntoViewIfNeeded();
      await expect(item).toBeVisible();
    }
  });

  test("should search menu items", async ({ page }) => {
    await page.getByPlaceholder(/cari/i).fill("nasi");
    const item = page.getByText(/nasi goreng/i).first();
    await item.scrollIntoViewIfNeeded();
    await expect(item).toBeVisible();
  });

  test("should add item to cart", async ({ page }) => {
    await page.getByText(/nasi goreng/i).first().click();
    await expect(page.getByText(/1 item/i).first()).toBeVisible();
  });

  test("should update cart quantity", async ({ page }) => {
    await page.getByText(/nasi goreng/i).first().click();
    await page.getByText(/nasi goreng/i).first().click();
    await expect(page.getByText(/2 item/i).first()).toBeVisible();
  });

  test("should enable checkout button when cart has items", async ({ page }) => {
    await page.getByText(/nasi goreng/i).first().click();
    const checkoutBtn = page.getByRole("button", { name: /proses pembayaran/i });
    await expect(checkoutBtn).toBeEnabled();
  });
});
