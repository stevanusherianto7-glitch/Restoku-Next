import { test, expect } from "@playwright/test";

test.describe("Reports", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page).toHaveURL("/dashboard");
    await page.goto("/reports");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display reports page", async ({ page }) => {
    await expect(page.getByText(/laporan & analitik/i)).toBeVisible();
  });

  test("should display period selector", async ({ page }) => {
    await expect(page.getByRole("button", { name: /harian/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /mingguan/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /bulanan/i })).toBeVisible();
  });

  test("should switch period", async ({ page }) => {
    await page.getByRole("button", { name: /mingguan/i }).click();
    await expect(page.getByRole("button", { name: /mingguan/i })).toBeVisible();
  });

  test("should display sales summary", async ({ page }) => {
    await expect(page.getByText(/omset/i).first()).toBeVisible();
    await expect(page.getByText(/transaksi/i).first()).toBeVisible();
  });

  test("should display top menu items", async ({ page }) => {
    const topMenu = page.getByText(/menu terlaris/i).first();
    await topMenu.scrollIntoViewIfNeeded();
    await expect(topMenu).toBeVisible();
  });
});

test.describe("Table Management", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    await page.getByLabel(/email/i).fill("admin@restoku.com");
    await page.getByLabel(/password/i).fill("password");
    await page.getByRole("button", { name: /masuk/i }).click();
    await expect(page).toHaveURL("/dashboard");
    await page.goto("/tables");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display table management page", async ({ page }) => {
    await expect(page.getByText(/denah meja/i)).toBeVisible();
  });

  test("should display add table button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /tambah meja/i }).first()).toBeVisible();
  });

  test("should open add table modal", async ({ page }) => {
    await page.getByRole("button", { name: /tambah meja/i }).first().click();
    await expect(
      page.getByRole("heading", { name: /tambah meja baru/i })
    ).toBeVisible();
  });

  test("should display QR code section", async ({ page }) => {
    await expect(page.getByText(/qr/i).first()).toBeVisible();
  });
});
