import { test, expect, type Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/email/i).fill("admin@restoku.com");
  await page.getByLabel(/password/i).fill("password");
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
}

test.describe("Reports", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");
  });

  test("should display reports page", async ({ page }) => {
    await expect(page.getByText(/laporan & analitik/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display period selector", async ({ page }) => {
    await expect(page.getByRole("button", { name: /harian/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /mingguan/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /bulanan/i })).toBeVisible({ timeout: 10000 });
  });

  test("should switch period", async ({ page }) => {
    const weeklyBtn = page.getByRole("button", { name: /mingguan/i });
    await expect(weeklyBtn).toBeVisible({ timeout: 10000 });
    await weeklyBtn.click();
    await expect(weeklyBtn).toBeVisible();
  });

  test("should display sales summary", async ({ page }) => {
    await expect(page.getByText(/omset/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/transaksi/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display top menu items", async ({ page }) => {
    const topMenu = page.getByText(/menu terlaris/i).first();
    await topMenu.scrollIntoViewIfNeeded();
    await expect(topMenu).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Table Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto("/tables");
    await page.waitForLoadState("networkidle");
  });

  test("should display table management page", async ({ page }) => {
    await expect(page.getByText(/denah meja/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("should display add table button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /tambah meja/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should open add table modal", async ({ page }) => {
    await page.getByRole("button", { name: /tambah meja/i }).first().click();
    await expect(
      page.getByRole("heading", { name: /tambah meja baru/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display QR code section", async ({ page }) => {
    await expect(page.getByText(/qr/i).first()).toBeVisible({ timeout: 10000 });
  });
});
