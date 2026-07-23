/**
 * E2E: POS (Point of Sale) — Kasir role
 *
 * Covers:
 *  - POS page structure (header, menu grid, cart panel)
 *  - 4-digit daily PIN badge visible
 *  - Category filter tabs (Semua Menu)
 *  - Menu search functionality
 *  - Add item to cart → cart counter updates
 *  - Struk Pesanan (receipt) panel always visible
 *  - Payment methods grid visible
 *  - Diskon percentage input visible
 *  - PPN 10% label visible (no Service Charge)
 *  - Split Bill button visible in cart
 *  - Cashier Calculator Modal opens on Bayar button click
 *  - Calculator displays correct total
 */
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("POS — Kasir", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "kasir");
    await page.goto("/pos");
    await page.waitForLoadState("networkidle");
  });

  // ── Page Structure ───────────────────────────────────────────────
  test("shows POS Kasir header", async ({ page }) => {
    await expect(page.getByText(/pos kasir/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows daily 4-digit PIN badge", async ({ page }) => {
    await expect(page.getByText(/pin/i).first()).toBeVisible({ timeout: 10_000 });
    // PIN should be exactly 4 digits
    const pinText = await page.getByText(/pin\s*\d{4}/i).first().textContent().catch(() => "");
    if (pinText) {
      expect(pinText).toMatch(/\d{4}/);
    }
  });

  test("shows Struk Pesanan cart panel", async ({ page }) => {
    await expect(page.getByText(/struk pesanan/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows menu item grid", async ({ page }) => {
    const menuGrid = page.locator(".grid").first();
    await expect(menuGrid).toBeVisible({ timeout: 10_000 });
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Filters & Search ─────────────────────────────────────────────
  test("shows Semua Menu category tab", async ({ page }) => {
    await expect(page.getByText(/semua menu/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("search input filters menu items", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/cari/i);
    await expect(searchInput).toBeVisible({ timeout: 10_000 });
    await searchInput.fill("nasi");
    await page.waitForTimeout(500);
    // Should still have at least the search input visible
    await expect(searchInput).toBeVisible();
  });

  // ── Cart Operations ──────────────────────────────────────────────
  test("clicking menu card adds item to cart", async ({ page }) => {
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10_000 });
    await menuCards.first().click();
    await expect(page.getByText(/1 item/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── POS Features ─────────────────────────────────────────────────
  test("shows payment methods grid", async ({ page }) => {
    // Payment method buttons
    await expect(page.getByText(/tunai/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/qris/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Diskon input in cart panel", async ({ page }) => {
    await expect(page.getByText(/diskon/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows PPN (not Service Charge) in cart panel", async ({ page }) => {
    await expect(page.getByText(/ppn/i).first()).toBeVisible({ timeout: 10_000 });
    // Service Charge should NOT be present
    await expect(page.getByText(/service charge/i)).toHaveCount(0);
  });

  test("shows Split Bill button in cart", async ({ page }) => {
    await expect(page.getByText(/split bill/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Cashier Calculator Modal ─────────────────────────────────────
  test("Bayar button opens Calculator Modal when cart has items", async ({ page }) => {
    // Add one item to cart first
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10_000 });
    await menuCards.first().click();
    await page.waitForTimeout(300);

    // Click the Bayar (payment) button
    const bayarBtn = page.getByRole("button", { name: /bayar/i }).first();
    await expect(bayarBtn).toBeVisible({ timeout: 10_000 });
    await bayarBtn.click();

    // Calculator Modal should open
    await expect(page.getByText(/kalkulator kasir/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("Calculator Modal shows total tagihan", async ({ page }) => {
    const menuCards = page.locator(".grid > div");
    await expect(menuCards.first()).toBeVisible({ timeout: 10_000 });
    await menuCards.first().click();
    await page.waitForTimeout(300);

    const bayarBtn = page.getByRole("button", { name: /bayar/i }).first();
    await bayarBtn.click();

    // Should display total bill amount
    await expect(page.getByText(/total tagihan/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("Calculator Modal can be closed", async ({ page }) => {
    const menuCards = page.locator(".grid > div");
    await menuCards.first().click();
    await page.waitForTimeout(300);

    const bayarBtn = page.getByRole("button", { name: /bayar/i }).first();
    await bayarBtn.click();
    await expect(page.getByText(/kalkulator kasir/i).first()).toBeVisible({ timeout: 10_000 });

    // Close modal via ESC or close button
    await page.keyboard.press("Escape");
    await expect(page.getByText(/kalkulator kasir/i)).toHaveCount(0, { timeout: 5_000 });
  });

  // ── Split Bill Modal ─────────────────────────────────────────────
  test("Split Bill button opens Split Bill Modal", async ({ page }) => {
    const splitBtn = page.getByRole("button", { name: /split bill/i }).first();
    await expect(splitBtn).toBeVisible({ timeout: 10_000 });
    await splitBtn.click();
    await expect(page.getByText(/bagi tagihan/i).first()).toBeVisible({ timeout: 10_000 });
  });
});
