import { describe, it, expect } from "vitest";
import {
  createOrderId,
  calculateOrderTotal,
  getStatusColor,
  getStatusLabel,
  type OrderItem,
} from "../entities/Order";

describe("Order Entity", () => {
  describe("createOrderId", () => {
    it("should create branded order id", () => {
      const id = createOrderId("order-123");
      expect(id).toBe("order-123");
    });
  });

  describe("calculateOrderTotal", () => {
    it("should calculate total from items", () => {
      const items: OrderItem[] = [
        { menu_id: "1", menu_name: "Nasi Goreng", quantity: 2, price: 25000, subtotal: 50000, cooking_status: "pending" },
        { menu_id: "2", menu_name: "Es Teh", quantity: 3, price: 5000, subtotal: 15000, cooking_status: "pending" },
      ];
      expect(calculateOrderTotal(items)).toBe(65000);
    });

    it("should return 0 for empty items", () => {
      expect(calculateOrderTotal([])).toBe(0);
    });

    it("should handle single item", () => {
      const items: OrderItem[] = [
        { menu_id: "1", menu_name: "Mie Ayam", quantity: 1, price: 20000, subtotal: 20000, cooking_status: "pending" },
      ];
      expect(calculateOrderTotal(items)).toBe(20000);
    });
  });

  describe("getStatusColor", () => {
    it("should return correct colors for each status", () => {
      expect(getStatusColor("pending")).toContain("yellow");
      expect(getStatusColor("confirmed")).toContain("blue");
      expect(getStatusColor("cooking")).toContain("orange");
      expect(getStatusColor("ready")).toContain("green");
      expect(getStatusColor("completed")).toContain("gray");
      expect(getStatusColor("cancelled")).toContain("red");
    });
  });

  describe("getStatusLabel", () => {
    it("should return correct labels for each status", () => {
      expect(getStatusLabel("pending")).toBe("Menunggu");
      expect(getStatusLabel("confirmed")).toBe("Dikonfirmasi");
      expect(getStatusLabel("cooking")).toBe("Sedang Dimasak");
      expect(getStatusLabel("ready")).toBe("Siap");
      expect(getStatusLabel("completed")).toBe("Selesai");
      expect(getStatusLabel("cancelled")).toBe("Dibatalkan");
    });
  });
});
