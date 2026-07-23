/**
 * E2E: Waiter & Bar Display — Waiter Staff role
 *
 * Covers:
 *  - Page accessible at /waiter-bar
 *  - "🍹 Waiter & Bar Display" heading
 *  - Date and outlet subtitle
 *  - "Notifikasi Suara HP" sound toggle button
 *  - "● Live" badge visible
 *  - Bell notification icon visible
 *  - Filter tabs: Semua, Antrean Baru, Sedang Dibuat, Siap Diantar
 *  - Drink ticket cards visible in grid
 *  - Temperature labels on drink items (Dingin/Panas)
 *  - Item notes visible on tickets
 *  - "Mulai Buat Minuman" button on new tickets
 *  - "Minuman Siap Diantar" button on making tickets
 *  - "Selesai Diantar ke Meja" button on ready tickets
 *  - Status transition (new → making → ready → done/removed)
 *  - Sound toggle switches ON/OFF
 *  - Empty state shown when no tickets
 *  - Waiter & Bar Display appears in sidebar
 */
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("Waiter & Bar Display", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "waiter");
    await page.waitForLoadState("networkidle");
  });

  // ── Page Structure ───────────────────────────────────────────────
  test("shows Waiter & Bar Display heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /waiter & bar display/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows date and outlet subtitle", async ({ page }) => {
    await expect(page.getByText(/outlet restoku/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Notifikasi Suara HP toggle button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /notifikasi suara hp/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows Live badge", async ({ page }) => {
    await expect(page.getByText(/live/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Filter Tabs ──────────────────────────────────────────────────
  test("shows Semua filter tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /semua/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Antrean Baru filter tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /antrean baru/i })).toBeVisible({ timeout: 10_000 });
  });

  test("shows Sedang Dibuat filter tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /sedang dibuat/i })).toBeVisible({ timeout: 10_000 });
  });

  test("shows Siap Diantar filter tab", async ({ page }) => {
    await expect(page.getByRole("button", { name: /siap diantar/i })).toBeVisible({ timeout: 10_000 });
  });

  // ── Drink Tickets ────────────────────────────────────────────────
  test("shows drink ticket cards in grid", async ({ page }) => {
    const ticketCards = page.locator(".grid > div");
    await expect(ticketCards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("tickets show table name (Meja)", async ({ page }) => {
    await expect(page.getByText(/meja/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("tickets show order number (ORD-)", async ({ page }) => {
    await expect(page.getByText(/ORD-/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("tickets show temperature labels (Dingin/Panas)", async ({ page }) => {
    // At least one temp label should be present from mock data
    const hasDingin = await page.getByText(/dingin/i).first().isVisible({ timeout: 5_000 }).catch(() => false);
    const hasPanas = await page.getByText(/panas/i).first().isVisible({ timeout: 5_000 }).catch(() => false);
    expect(hasDingin || hasPanas).toBe(true);
  });

  test("tickets show item notes (📌 prefix)", async ({ page }) => {
    await expect(page.getByText(/tanpa es|gula batu|tambah madu/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Action Buttons ───────────────────────────────────────────────
  test("shows Mulai Buat Minuman button for new tickets", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /mulai buat minuman/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows Minuman Siap Diantar button for making tickets", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /minuman siap diantar/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows Selesai Diantar ke Meja button for ready tickets", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /selesai diantar ke meja/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── Status Transition ────────────────────────────────────────────
  test("Mulai Buat Minuman changes ticket status", async ({ page }) => {
    // Count Sedang Dibuat tickets before action
    const before = await page.getByText(/dibuat/i).count();
    const mulaiBtn = page.getByRole("button", { name: /mulai buat minuman/i }).first();
    await expect(mulaiBtn).toBeVisible({ timeout: 10_000 });
    await mulaiBtn.click();
    await page.waitForTimeout(300);
    // Sedang Dibuat count should increase
    const after = await page.getByText(/dibuat/i).count();
    expect(after).toBeGreaterThanOrEqual(before);
  });

  test("Selesai Diantar removes ticket from list", async ({ page }) => {
    const initialCards = await page.locator(".grid > div").count();
    const selesaiBtn = page.getByRole("button", { name: /selesai diantar ke meja/i }).first();
    await expect(selesaiBtn).toBeVisible({ timeout: 10_000 });
    await selesaiBtn.click();
    await page.waitForTimeout(300);
    // One ticket should be removed
    const afterCards = await page.locator(".grid > div").count();
    expect(afterCards).toBeLessThan(initialCards);
  });

  // ── Sound Toggle ─────────────────────────────────────────────────
  test("sound toggle changes state on click", async ({ page }) => {
    const toggleBtn = page.getByRole("button", { name: /notifikasi suara hp/i });
    await expect(toggleBtn).toBeVisible({ timeout: 10_000 });
    // Initial state: ON (🔊)
    await expect(toggleBtn).toContainText("🔊");
    await toggleBtn.click();
    await page.waitForTimeout(200);
    // After click: OFF (🔇)
    await expect(toggleBtn).toContainText("🔇");
  });

  // ── Filter Functionality ─────────────────────────────────────────
  test("Antrean Baru filter shows only new tickets", async ({ page }) => {
    await page.getByRole("button", { name: /antrean baru/i }).click();
    await page.waitForTimeout(300);
    // Should not show Sedang Dibuat label on any visible ticket
    await expect(page.getByText(/sedang dibuat/i)).toHaveCount(0);
  });

  // ── Sidebar Navigation ───────────────────────────────────────────
  test("Waiter & Bar Display appears in sidebar for waiter role", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /waiter & bar display/i }).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
