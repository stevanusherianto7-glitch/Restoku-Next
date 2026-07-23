import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display hero section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /kelola restoran lebih mudah/i }).first()
    ).toBeVisible();
    await expect(page.getByText(/sistem pos/i).first()).toBeVisible();
  });

  test("should display navigation", async ({ page }) => {
    await expect(page.getByRole("navigation").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /fitur/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /harga/i }).first()).toBeVisible();
  });

  test("should navigate to login", async ({ page }) => {
    await page.getByRole("link", { name: /masuk/i }).first().click();
    await expect(page).toHaveURL("/login");
  });

  test("should display features section", async ({ page }) => {
    await page.getByText(/fitur lengkap/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/pos cepat/i).first()).toBeVisible();
    await expect(page.getByText(/menu digital/i).first()).toBeVisible();
  });

  test("should display pricing section", async ({ page }) => {
    await page.getByText(/harga sesuai kebutuhan/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/gratis/i).first()).toBeVisible();
    await expect(page.getByText(/professional/i).first()).toBeVisible();
  });

  test("should display footer", async ({ page }) => {
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByText(/© 2026 restoku/i)).toBeVisible();
  });
});
