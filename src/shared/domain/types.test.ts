import { describe, it, expect } from "vitest";
import {
  createRestaurantId,
  createUserId,
  createMoney,
} from "@shared/domain/types";

describe("Shared Domain Types", () => {
  describe("createRestaurantId", () => {
    it("should create a branded RestaurantId from string", () => {
      const id = createRestaurantId("rest-123");
      expect(id).toBe("rest-123");
    });

    it("should be usable as a string", () => {
      const id = createRestaurantId("abc");
      expect(id.length).toBe(3);
    });

    it("should create distinct branded values for different inputs", () => {
      const id1 = createRestaurantId("r1");
      const id2 = createRestaurantId("r2");
      expect(id1).not.toBe(id2);
    });
  });

  describe("createUserId", () => {
    it("should create a branded UserId from string", () => {
      const id = createUserId("user-456");
      expect(id).toBe("user-456");
    });

    it("should be usable as a string", () => {
      const id = createUserId("xyz");
      expect(id.toUpperCase()).toBe("XYZ");
    });
  });

  describe("createMoney", () => {
    it("should create Money from a positive number", () => {
      const money = createMoney(25000);
      expect(money).toBe(25000);
    });

    it("should create Money from zero", () => {
      const money = createMoney(0);
      expect(money).toBe(0);
    });

    it("should throw for negative amount", () => {
      expect(() => createMoney(-100)).toThrow("Money cannot be negative");
    });

    it("should support decimal amounts", () => {
      const money = createMoney(99.99);
      expect(money).toBeCloseTo(99.99);
    });
  });
});
