/**
 * E2E: Dashboard — Owner & Manager view
 *
 * Covers:
 *  - KPI stat cards (Omset, Pesanan, Pesanan Aktif, Peringatan Stok)
 *  - Sidebar navigation visible
 *  - Real-time orders table
 *  - Top-selling menu section
 *  - Navigation to POS from dashboard
 *  - Navigation to Menu management
 *  - Sidebar shows "Owner View" for Owner, not for Manager
 */
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("Dashboard — Owner", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "owner");
  });

  test("shows Dashboard Partner heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /dashboard partner/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows Omset Penjualan stat card", async ({ page }) => {
    await expect(page.getByText(/omset penjualan/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Total Pesanan stat card", async ({ page }) => {
    await expect(page.getByText(/total pesanan/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Pesanan Real-time table", async ({ page }) => {
    await expect(page.getByText(/pesanan real-time/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Menu Terlaris section", async ({ page }) => {
    await expect(page.getByText(/menu terlaris/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("sidebar navigation is visible", async ({ page }) => {
    await expect(page.getByRole("navigation").first()).toBeVisible({ timeout: 10_000 });
  });

  test("Owner View sidebar group is visible for owner", async ({ page }) => {
    await expect(page.getByText(/owner view/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("navigates to /pos from Kasir link", async ({ page }) => {
    await page.getByRole("link", { name: /kasir \(pos\)/i }).first().click();
    await page.waitForURL("**/pos", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/pos/);
  });

  test("navigates to /menu from Produk & Menu link", async ({ page }) => {
    const manLink = page.getByRole("link", { name: /produk & menu/i }).first();
    if (!(await manLink.isVisible().catch(() => false))) {
      const manGroup = page.getByText("Manajemen").first();
      if (await manGroup.isVisible().catch(() => false)) {
        await manGroup.click();
      }
    }
    await manLink.click();
    await page.waitForURL("**/menu", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/menu/);
  });

  test("logout from dashboard returns to /login", async ({ page }) => {
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

test.describe("Dashboard — Manager", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "manager");
  });

  test("Manager sees Dashboard Partner heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /dashboard partner/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("Manager sees Laporan sidebar group", async ({ page }) => {
    await expect(page.getByText("Laporan").first()).toBeVisible({ timeout: 10_000 });
  });

  test("Manager sees Keuangan sidebar group", async ({ page }) => {
    await expect(page.getByText("Keuangan").first()).toBeVisible({ timeout: 10_000 });
  });

  test("Manager does NOT see Owner View sidebar group", async ({ page }) => {
    await expect(page.getByText(/owner view/i)).toHaveCount(0);
  });

  test("Manager badge shown in sidebar footer", async ({ page }) => {
    await expect(page.getByText(/manager/i).last()).toBeVisible({ timeout: 10_000 });
  });
});
