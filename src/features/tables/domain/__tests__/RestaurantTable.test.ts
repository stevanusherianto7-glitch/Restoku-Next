import { describe, it, expect } from "vitest";
import { createTableId, getQrUrl } from "../entities/RestaurantTable";

describe("RestaurantTable Entity", () => {
  describe("createTableId", () => {
    it("should create branded table id", () => {
      const id = createTableId("table-123");
      expect(id).toBe("table-123");
    });
  });

  describe("getQrUrl", () => {
    it("should generate QR URL with table number", () => {
      const url = getQrUrl("rest-1", 5);
      expect(url).toContain("rest-1");
      expect(url).toContain("table=5");
    });

    it("should use app URL from env", () => {
      const url = getQrUrl("rest-1", 1);
      expect(url).toMatch(/^https?:\/\//);
    });
  });
});
