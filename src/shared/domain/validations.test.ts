import { describe, it, expect } from "vitest";
import {
  loginSchema,
  menuSchema,
  orderItemSchema,
  orderSchema,
  tableSchema,
} from "@shared/domain/validations";

describe("Domain Zod Validations", () => {
  describe("loginSchema", () => {
    it("should validate valid login credentials", () => {
      const result = loginSchema.safeParse({
        email: "user@restoku.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail on invalid email format", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Format email tidak valid");
      }
    });

    it("should fail on empty email", () => {
      const result = loginSchema.safeParse({
        email: "",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("should fail on short password (< 6 chars)", () => {
      const result = loginSchema.safeParse({
        email: "user@restoku.com",
        password: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Password minimal 6 karakter");
      }
    });
  });

  describe("menuSchema", () => {
    it("should validate a complete valid menu item", () => {
      const result = menuSchema.safeParse({
        name: "Nasi Goreng Cabe",
        description: "Pedas dan nikmat",
        price: 25000,
        category_id: "cat-1",
        is_available: true,
        is_popular: true,
        prep_time: 15,
      });
      expect(result.success).toBe(true);
    });

    it("should set default values for optional boolean flags", () => {
      const result = menuSchema.parse({
        name: "Es Teh",
        price: 5000,
        category_id: "cat-2",
      });
      expect(result.is_available).toBe(true);
      expect(result.is_popular).toBe(false);
    });

    it("should fail on negative price", () => {
      const result = menuSchema.safeParse({
        name: "Teh",
        price: -5000,
        category_id: "cat-2",
      });
      expect(result.success).toBe(false);
    });

    it("should fail on prep_time > 480 mins", () => {
      const result = menuSchema.safeParse({
        name: "Rendang",
        price: 50000,
        category_id: "cat-1",
        prep_time: 500,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("orderItemSchema & orderSchema", () => {
    it("should validate valid order item", () => {
      const itemResult = orderItemSchema.safeParse({
        menu_id: "m-1",
        quantity: 2,
        variant: "pedas",
        notes: "tanpa bawang",
      });
      expect(itemResult.success).toBe(true);
    });

    it("should fail on quantity < 1", () => {
      const itemResult = orderItemSchema.safeParse({
        menu_id: "m-1",
        quantity: 0,
      });
      expect(itemResult.success).toBe(false);
    });

    it("should validate full order payload", () => {
      const result = orderSchema.safeParse({
        table_number: 4,
        items: [
          { menu_id: "m-1", quantity: 2 },
          { menu_id: "m-2", quantity: 1 },
        ],
        notes: "Diantar bertahap",
      });
      expect(result.success).toBe(true);
    });

    it("should fail on empty order items array", () => {
      const result = orderSchema.safeParse({
        table_number: 4,
        items: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("tableSchema", () => {
    it("should validate table data", () => {
      const result = tableSchema.safeParse({
        name: "Meja VIP 1",
        number: 1,
      });
      expect(result.success).toBe(true);
    });

    it("should fail on invalid table number", () => {
      const result = tableSchema.safeParse({
        name: "Meja Bad",
        number: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});
