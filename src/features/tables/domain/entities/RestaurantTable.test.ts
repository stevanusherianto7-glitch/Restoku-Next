import { describe, it, expect } from "vitest";
import {
  createTableId,
  getQrUrl,
} from "@features/tables/domain/entities/RestaurantTable";

describe("RestaurantTable Entity", () => {
  describe("createTableId", () => {
    it("should create a branded TableId from string", () => {
      const id = createTableId("table-1");
      expect(id).toBe("table-1");
    });
  });

  describe("getQrUrl", () => {
    it("should generate a QR URL with restaurantId and table number", () => {
      const url = getQrUrl("rest-abc", 5);
      expect(url).toContain("/menu/rest-abc");
      expect(url).toContain("table=5");
    });

    it("should use VITE_APP_URL from env", () => {
      const url = getQrUrl("rest-1", 1);
      expect(url).toMatch(/^http/);
    });

    it("should handle different table numbers", () => {
      expect(getQrUrl("r1", 1)).toContain("table=1");
      expect(getQrUrl("r1", 99)).toContain("table=99");
    });
  });
});
