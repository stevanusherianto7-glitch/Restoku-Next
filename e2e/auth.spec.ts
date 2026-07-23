import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /masuk/i })).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("wrong@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page.locator(".bg-red-50")).toBeVisible();
  });

  test("should redirect to dashboard after login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await page.waitForURL("/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL("/dashboard");
  });

  test("should logout successfully", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await page.waitForURL("/dashboard", { timeout: 15000 });
    await expect(page).toHaveURL("/dashboard");

    // Logout via profile title
    await page.getByTitle(/logout/i).first().click();
    await page.waitForURL("/login", { timeout: 15000 });
    await expect(page).toHaveURL("/login");
  });

  test("should protect routes when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });
});
