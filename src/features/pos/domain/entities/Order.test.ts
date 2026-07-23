import { describe, it, expect } from "vitest";
import {
  createOrderId,
  calculateOrderTotal,
  getStatusColor,
  getStatusLabel,
  type OrderItem,
  type OrderStatus,
} from "@features/pos/domain/entities/Order";

describe("Order Entity", () => {
  describe("createOrderId", () => {
    it("should create a branded OrderId from string", () => {
      const id = createOrderId("order-789");
      expect(id).toBe("order-789");
    });
  });

  describe("calculateOrderTotal", () => {
    it("should return 0 for empty items", () => {
      expect(calculateOrderTotal([])).toBe(0);
    });

    it("should sum single item subtotal", () => {
      const items: OrderItem[] = [
        { menu_id: "m1", menu_name: "Nasi", quantity: 2, price: 15000, subtotal: 30000, cooking_status: "pending" },
      ];
      expect(calculateOrderTotal(items)).toBe(30000);
    });

    it("should sum multiple items subtotals", () => {
      const items: OrderItem[] = [
        { menu_id: "m1", menu_name: "Nasi", quantity: 2, price: 15000, subtotal: 30000, cooking_status: "pending" },
        { menu_id: "m2", menu_name: "Teh", quantity: 1, price: 5000, subtotal: 5000, cooking_status: "pending" },
        { menu_id: "m3", menu_name: "Ayam", quantity: 3, price: 20000, subtotal: 60000, cooking_status: "pending" },
      ];
      expect(calculateOrderTotal(items)).toBe(95000);
    });
  });

  describe("getStatusColor", () => {
    const statuses: OrderStatus[] = [
      "pending",
      "confirmed",
      "cooking",
      "ready",
      "served",
      "completed",
      "cancelled",
    ];

    it.each(statuses)("should return a non-empty string for status '%s'", (status) => {
      const result = getStatusColor(status);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("should return yellow classes for pending", () => {
      expect(getStatusColor("pending")).toContain("yellow");
    });

    it("should return blue classes for confirmed", () => {
      expect(getStatusColor("confirmed")).toContain("blue");
    });

    it("should return orange classes for cooking", () => {
      expect(getStatusColor("cooking")).toContain("orange");
    });

    it("should return green classes for ready", () => {
      expect(getStatusColor("ready")).toContain("green");
    });

    it("should return emerald classes for served", () => {
      expect(getStatusColor("served")).toContain("emerald");
    });

    it("should return red classes for cancelled", () => {
      expect(getStatusColor("cancelled")).toContain("red");
    });
  });

  describe("getStatusLabel", () => {
    it("should return Menunggu for pending", () => {
      expect(getStatusLabel("pending")).toBe("Menunggu");
    });

    it("should return Dikonfirmasi for confirmed", () => {
      expect(getStatusLabel("confirmed")).toBe("Dikonfirmasi");
    });

    it("should return Sedang Dimasak for cooking", () => {
      expect(getStatusLabel("cooking")).toBe("Sedang Dimasak");
    });

    it("should return Siap for ready", () => {
      expect(getStatusLabel("ready")).toBe("Siap");
    });

    it("should return Terhidang for served", () => {
      expect(getStatusLabel("served")).toBe("Terhidang");
    });

    it("should return Selesai for completed", () => {
      expect(getStatusLabel("completed")).toBe("Selesai");
    });

    it("should return Dibatalkan for cancelled", () => {
      expect(getStatusLabel("cancelled")).toBe("Dibatalkan");
    });
  });
});
