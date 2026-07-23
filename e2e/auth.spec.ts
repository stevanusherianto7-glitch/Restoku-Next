/**
 * E2E: Authentication & Role-Based Login
 *
 * Covers:
 *  - Login page UI elements
 *  - Invalid credential error
 *  - 5 Demo Quick-Login buttons (Kitchen, Waiter, Kasir, Manager, Owner)
 *  - Each role redirects to correct page
 *  - Route protection (unauthenticated redirect to /login)
 *  - Logout flow
 */
import { test, expect } from "@playwright/test";
import { loginAs, quickDemoLogin } from "./helpers";

test.describe("Authentication", () => {
  // ── UI Structure ────────────────────────────────────────────────
  test("login page shows form elements", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /masuk/i })).toBeVisible();
    await expect(page.getByText(/uji coba demo akun/i)).toBeVisible();
  });

  test("login page shows all 5 demo role buttons", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: /kitchen/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /waiter/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /kasir/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /manager/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /owner/i })).toBeVisible();
  });

  // ── Credential Validation ────────────────────────────────────────
  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByLabel(/email/i).fill("invalid@test.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page.locator(".bg-red-50")).toBeVisible({ timeout: 10_000 });
  });

  // ── Role-Based Redirects ─────────────────────────────────────────
  test("Owner login redirects to /dashboard", async ({ page }) => {
    await loginAs(page, "owner");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("Manager login redirects to /dashboard", async ({ page }) => {
    await loginAs(page, "manager");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("Kasir login redirects to /pos", async ({ page }) => {
    await loginAs(page, "kasir");
    await expect(page).toHaveURL(/\/pos/);
  });

  test("Kitchen login redirects to /kitchen", async ({ page }) => {
    await loginAs(page, "kitchen");
    await expect(page).toHaveURL(/\/kitchen/);
  });

  test("Waiter login redirects to /waiter-bar", async ({ page }) => {
    await loginAs(page, "waiter");
    await expect(page).toHaveURL(/\/waiter-bar/);
  });

  // ── Quick Demo Button Redirects ──────────────────────────────────
  test("Quick Kitchen button redirects to /kitchen", async ({ page }) => {
    await quickDemoLogin(page, "kitchen");
    await expect(page).toHaveURL(/\/kitchen/);
  });

  test("Quick Waiter button redirects to /waiter-bar", async ({ page }) => {
    await quickDemoLogin(page, "waiter");
    await expect(page).toHaveURL(/\/waiter-bar/);
  });

  test("Quick Manager button redirects to /dashboard", async ({ page }) => {
    await quickDemoLogin(page, "manager");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // ── Route Protection ─────────────────────────────────────────────
  test("unauthenticated access to /dashboard redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated access to /pos redirects to /login", async ({ page }) => {
    await page.goto("/pos");
    await page.waitForURL("**/login", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated access to /kitchen redirects to /login", async ({ page }) => {
    await page.goto("/kitchen");
    await page.waitForURL("**/login", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated access to /waiter-bar redirects to /login", async ({ page }) => {
    await page.goto("/waiter-bar");
    await page.waitForURL("**/login", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  // ── Logout ───────────────────────────────────────────────────────
  test("logout returns to /login", async ({ page }) => {
    await loginAs(page, "owner");
    const logoutBtn = page.getByTitle(/logout/i).first();
    if (await logoutBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await logoutBtn.click();
    } else {
      await page.getByRole("button", { name: /keluar|logout/i }).first().click();
    }
    await page.waitForURL("**/login", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
