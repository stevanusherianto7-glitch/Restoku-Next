import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display hero section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /kelola restoran/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display navigation", async ({ page }) => {
    await expect(page.getByRole("banner")).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to login", async ({ page }) => {
    await page.getByRole("button", { name: /masuk/i }).first().click();
    await page.waitForURL("**/login", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("should display features section", async ({ page }) => {
    const featuresHeading = page.getByRole("heading", { name: /fitur|semua modul/i }).first();
    await featuresHeading.scrollIntoViewIfNeeded();
    await expect(featuresHeading).toBeVisible({ timeout: 10000 });
  });

  test("should display pricing section", async ({ page }) => {
    const pricingHeading = page.getByRole("heading", { name: /harga/i }).first();
    await pricingHeading.scrollIntoViewIfNeeded();
    await expect(pricingHeading).toBeVisible({ timeout: 10000 });
  });

  test("should display footer", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect(page.getByText(/© 2026 restoku/i)).toBeVisible({ timeout: 10000 });
  });
});
