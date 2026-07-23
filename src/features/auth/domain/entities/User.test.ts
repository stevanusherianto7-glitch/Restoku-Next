import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  canManageInventory,
  canProcessPayment,
  type User,
} from "@features/auth/domain/entities/User";
import { createUserId } from "@shared/domain/types";

function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: createUserId("user-1"),
    email: "test@restoku.com",
    name: "Test User",
    role: "cashier",
    restaurantId: "rest-1",
    tenant_id: "t1",
    outlet_id: null,
    ...overrides,
  };
}

describe("User Entity", () => {
  describe("isValidEmail", () => {
    it("should return true for valid email", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
    });

    it("should return true for email with subdomain", () => {
      expect(isValidEmail("admin@mail.restoku.id")).toBe(true);
    });

    it("should return false for empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });

    it("should return false for missing @", () => {
      expect(isValidEmail("userexample.com")).toBe(false);
    });

    it("should return false for missing domain", () => {
      expect(isValidEmail("user@")).toBe(false);
    });

    it("should return false for missing local part", () => {
      expect(isValidEmail("@example.com")).toBe(false);
    });

    it("should return false for email with spaces", () => {
      expect(isValidEmail("user @example.com")).toBe(false);
    });
  });

  describe("canManageInventory", () => {
    it("should allow owner to manage inventory", () => {
      expect(canManageInventory(createTestUser({ role: "owner" }))).toBe(true);
    });

    it("should allow manager to manage inventory", () => {
      expect(canManageInventory(createTestUser({ role: "manager" }))).toBe(true);
    });

    it("should deny cashier from managing inventory", () => {
      expect(canManageInventory(createTestUser({ role: "cashier" }))).toBe(false);
    });

    it("should deny kitchen from managing inventory", () => {
      expect(canManageInventory(createTestUser({ role: "kitchen" }))).toBe(false);
    });
  });

  describe("canProcessPayment", () => {
    it("should allow owner to process payment", () => {
      expect(canProcessPayment(createTestUser({ role: "owner" }))).toBe(true);
    });

    it("should allow manager to process payment", () => {
      expect(canProcessPayment(createTestUser({ role: "manager" }))).toBe(true);
    });

    it("should allow cashier to process payment", () => {
      expect(canProcessPayment(createTestUser({ role: "cashier" }))).toBe(true);
    });

    it("should deny kitchen from processing payment", () => {
      expect(canProcessPayment(createTestUser({ role: "kitchen" }))).toBe(false);
    });
  });
});
