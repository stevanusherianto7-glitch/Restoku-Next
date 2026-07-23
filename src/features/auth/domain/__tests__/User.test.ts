import { describe, it, expect } from "vitest";
import { isValidEmail, canManageInventory, canProcessPayment, type User } from "../entities/User";

describe("User Entity", () => {
  const owner: User = {
    id: "user-1" as ReturnType<typeof import("@shared/domain/types").createUserId>,
    email: "owner@example.com",
    name: "Owner",
    role: "owner",
    restaurantId: "rest-1",
    tenant_id: "tenant-1",
    outlet_id: null,
  };

  const manager: User = { ...owner, id: "user-2" as ReturnType<typeof import("@shared/domain/types").createUserId>, role: "manager" };
  const cashier: User = { ...owner, id: "user-3" as ReturnType<typeof import("@shared/domain/types").createUserId>, role: "cashier" };
  const kitchen: User = { ...owner, id: "user-4" as ReturnType<typeof import("@shared/domain/types").createUserId>, role: "kitchen" };

  describe("isValidEmail", () => {
    it("should return true for valid email", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("test@test.co.id")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("canManageInventory", () => {
    it("should return true for owner", () => {
      expect(canManageInventory(owner)).toBe(true);
    });

    it("should return true for manager", () => {
      expect(canManageInventory(manager)).toBe(true);
    });

    it("should return false for cashier", () => {
      expect(canManageInventory(cashier)).toBe(false);
    });

    it("should return false for kitchen", () => {
      expect(canManageInventory(kitchen)).toBe(false);
    });
  });

  describe("canProcessPayment", () => {
    it("should return true for owner", () => {
      expect(canProcessPayment(owner)).toBe(true);
    });

    it("should return true for manager", () => {
      expect(canProcessPayment(manager)).toBe(true);
    });

    it("should return true for cashier", () => {
      expect(canProcessPayment(cashier)).toBe(true);
    });

    it("should return false for kitchen", () => {
      expect(canProcessPayment(kitchen)).toBe(false);
    });
  });
});
