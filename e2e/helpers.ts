/**
 * E2E Test Helpers — shared utilities for all Playwright specs.
 * All demo credentials map to mock users in mockData.ts.
 */
import type { Page } from "@playwright/test";

// ─────────────────────────────────────────────
// CREDENTIALS (must match mockData.ts mockUsers)
// ─────────────────────────────────────────────
export const CREDENTIALS = {
  owner:   { email: "budi@restoku.id",  password: "password123", redirect: "/dashboard" },
  manager: { email: "siti@restoku.id",  password: "password123", redirect: "/dashboard" },
  kasir:   { email: "andi@restoku.id",  password: "password123", redirect: "/pos"       },
  kitchen: { email: "chef@restoku.id",  password: "password123", redirect: "/kitchen"   },
  waiter:  { email: "sari@restoku.id",  password: "password123", redirect: "/waiter-bar"},
} as const;

export type RoleKey = keyof typeof CREDENTIALS;

// ─────────────────────────────────────────────
// SHARED LOGIN HELPER
// ─────────────────────────────────────────────
export async function loginAs(page: Page, role: RoleKey): Promise<void> {
  const { email, password, redirect } = CREDENTIALS[role];
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /masuk/i }).click();
  await page.waitForURL(`**${redirect}`, { timeout: 15_000 });
}

/** Login via the Quick Demo button (bypasses form fill). */
export async function quickDemoLogin(page: Page, role: RoleKey): Promise<void> {
  const labelMap: Record<RoleKey, RegExp> = {
    owner:   /owner/i,
    manager: /manager/i,
    kasir:   /kasir/i,
    kitchen: /kitchen/i,
    waiter:  /waiter/i,
  };
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: labelMap[role] }).click();
  await page.waitForURL(`**${CREDENTIALS[role].redirect}`, { timeout: 15_000 });
}
