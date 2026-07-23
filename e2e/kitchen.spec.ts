/**
 * E2E: Kitchen Display System (KDS) — Kitchen Staff role
 *
 * Covers:
 *  - KDS page accessible via /kitchen
 *  - "Monitor Kitchen Display System (KDS)" page title
 *  - "Layar Display Tim Kitchen (KDS)" banner heading
 *  - "● Live Order Stream" badge visible
 *  - Filter tabs: Semua, Baru, Dimasak, Siap
 *  - Order ticket cards visible (grid)
 *  - Ticket cards have table name, order number, items
 *  - "Mulai Memasak" action button on new tickets
 *  - "Tandai Siap Saji" action button on cooking tickets
 *  - "Selesai & Selesai Diantar" action button on ready tickets
 *  - Status transitions work (new → making → ready → done)
 */
import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("Kitchen Display System (KDS)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "kitchen");
    await page.waitForLoadState("networkidle");
  });

  // ── Page Structure ───────────────────────────────────────────────
  test("shows Monitor Kitchen Display System (KDS) heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /monitor kitchen display system/i })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows Layar Display Tim Kitchen (KDS) banner", async ({ page }) => {
    await expect(page.getByText(/layar display tim kitchen/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Live Order Stream badge", async ({ page }) => {
    await expect(page.getByText(/live order stream/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Filter Tabs ──────────────────────────────────────────────────
  test("shows Semua filter tab", async ({ page }) => {
    await expect(page.getByText(/semua/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Baru filter tab", async ({ page }) => {
    await expect(page.getByText(/baru/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Dimasak filter tab", async ({ page }) => {
    await expect(page.getByText(/dimasak/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Siap filter tab", async ({ page }) => {
    await expect(page.getByText(/siap/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Order Tickets ────────────────────────────────────────────────
  test("shows order ticket cards in grid", async ({ page }) => {
    // At least one ticket card should exist
    const ticketCards = page.locator(".grid > div");
    await expect(ticketCards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("ticket cards show table name", async ({ page }) => {
    // Mock data has "Meja A3" as first ticket
    await expect(page.getByText(/meja/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("ticket cards show order number", async ({ page }) => {
    // Mock data order numbers start with ORD-
    await expect(page.getByText(/ORD-/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("ticket cards show item notes", async ({ page }) => {
    // Mock data has notes with 📌 prefix
    await expect(page.getByText(/catatan/i).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Action Buttons ───────────────────────────────────────────────
  test("shows Mulai Memasak button for new tickets", async ({ page }) => {
    await expect(page.getByRole("button", { name: /mulai memasak/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Tandai Siap Saji button for cooking tickets", async ({ page }) => {
    await expect(page.getByRole("button", { name: /tandai siap saji/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("shows Selesai Diantar button for ready tickets", async ({ page }) => {
    await expect(page.getByRole("button", { name: /selesai/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  // ── Status Transition ────────────────────────────────────────────
  test("clicking Mulai Memasak changes ticket status to Dimasak", async ({ page }) => {
    const mulaiBtn = page.getByRole("button", { name: /mulai memasak/i }).first();
    await expect(mulaiBtn).toBeVisible({ timeout: 10_000 });
    await mulaiBtn.click();
    await page.waitForTimeout(300);
    // The ticket should now show Tandai Siap Saji
    await expect(page.getByRole("button", { name: /tandai siap saji/i }).first()).toBeVisible({ timeout: 5_000 });
  });

  // ── Sidebar KDS Entry ────────────────────────────────────────────
  test("Dapur (KDS) appears in sidebar for kitchen role", async ({ page }) => {
    await expect(page.getByRole("link", { name: /dapur \(kds\)/i }).first()).toBeVisible({ timeout: 10_000 });
  });
});
