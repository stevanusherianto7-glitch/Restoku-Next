import { describe, it, expect } from "vitest";
import { loginSchema, menuSchema, orderSchema, tableSchema } from "../validations";

describe("loginSchema", () => {
  it("should validate correct login input", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({ email: "invalid", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "12345" });
    expect(result.success).toBe(false);
  });
});

describe("menuSchema", () => {
  it("should validate correct menu input", () => {
    const result = menuSchema.safeParse({ name: "Nasi Goreng", price: 25000, category_id: "cat-1" });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = menuSchema.safeParse({ name: "", price: 25000, category_id: "cat-1" });
    expect(result.success).toBe(false);
  });

  it("should reject negative price", () => {
    const result = menuSchema.safeParse({ name: "Nasi Goreng", price: -1000, category_id: "cat-1" });
    expect(result.success).toBe(false);
  });
});

describe("orderSchema", () => {
  it("should validate correct order", () => {
    const result = orderSchema.safeParse({
      table_number: 1,
      items: [{ menu_id: "1", quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty items", () => {
    const result = orderSchema.safeParse({ table_number: 1, items: [] });
    expect(result.success).toBe(false);
  });

  it("should reject zero quantity", () => {
    const result = orderSchema.safeParse({
      table_number: 1,
      items: [{ menu_id: "1", quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });
});

describe("tableSchema", () => {
  it("should validate correct table", () => {
    const result = tableSchema.safeParse({ name: "VIP 1", number: 1 });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = tableSchema.safeParse({ name: "", number: 1 });
    expect(result.success).toBe(false);
  });

  it("should reject zero number", () => {
    const result = tableSchema.safeParse({ name: "VIP 1", number: 0 });
    expect(result.success).toBe(false);
  });
});
