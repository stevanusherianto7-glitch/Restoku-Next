import { describe, it, expect } from "vitest";
import {
  createUserId,
  createRestaurantId,
  createMoney,
} from "../types";

describe("Branded Types", () => {
  describe("createUserId", () => {
    it("should create branded user id", () => {
      const id = createUserId("user-123");
      expect(id).toBe("user-123");
    });

    it("should create different user ids", () => {
      const id1 = createUserId("user-1");
      const id2 = createUserId("user-2");
      expect(id1).not.toBe(id2);
    });
  });

  describe("createRestaurantId", () => {
    it("should create branded restaurant id", () => {
      const id = createRestaurantId("rest-456");
      expect(id).toBe("rest-456");
    });
  });

  describe("Money", () => {
    it("should create money value", () => {
      const money = createMoney(25000);
      expect(money).toBe(25000);
    });

    it("should throw error for negative money", () => {
      expect(() => createMoney(-1000)).toThrow("Money cannot be negative");
    });

    it("should create zero money", () => {
      const money = createMoney(0);
      expect(money).toBe(0);
    });

    it("should create large money value", () => {
      const money = createMoney(1000000000);
      expect(money).toBe(1000000000);
    });
  });
});
