import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display hero section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /restoku/i })).toBeVisible();
    await expect(page.getByText(/sistem point of sale/i)).toBeVisible();
  });

  test("should display navigation", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("link", { name: /fitur/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /harga/i })).toBeVisible();
  });

  test("should navigate to login", async ({ page }) => {
    await page.getByRole("link", { name: /masuk/i }).first().click();
    await expect(page).toHaveURL("/login");
  });

  test("should display features section", async ({ page }) => {
    await page.getByText(/fitur unggulan/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/pos & kasir/i)).toBeVisible();
    await expect(page.getByText(/menu digital/i)).toBeVisible();
  });

  test("should display pricing section", async ({ page }) => {
    await page.getByText(/pilih paket/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/gratis/i)).toBeVisible();
    await expect(page.getByText(/pro/i)).toBeVisible();
  });

  test("should display footer", async ({ page }) => {
    await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
    await expect(page.getByText(/© 2024 restoku/i)).toBeVisible();
  });
});
