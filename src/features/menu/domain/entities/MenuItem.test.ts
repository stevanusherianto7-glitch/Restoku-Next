import { describe, it, expect } from "vitest";
import {
  createMenuId,
  createCategoryId,
  formatPrice,
  isAvailable,
  getMenuBadges,
  type MenuItem,
  type MenuId,
  type CategoryId,
} from "@features/menu/domain/entities/MenuItem";

function createTestMenuItem(overrides: Partial<MenuItem> = {}): MenuItem {
  return {
    id: "menu-1" as MenuId,
    name: "Nasi Goreng",
    description: "Nasi goreng spesial",
    price: 25000,
    category_id: "cat-1" as CategoryId,
    category: "makanan",
    image_url: null,
    status: "active",
    is_popular: false,
    is_new: false,
    is_promo: false,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("MenuItem Entity", () => {
  describe("createMenuId", () => {
    it("should create a branded MenuId from string", () => {
      const id = createMenuId("menu-123");
      expect(id).toBe("menu-123");
    });
  });

  describe("createCategoryId", () => {
    it("should create a branded CategoryId from string", () => {
      const id = createCategoryId("cat-456");
      expect(id).toBe("cat-456");
    });
  });

  describe("formatPrice", () => {
    it("should format price in IDR currency", () => {
      const result = formatPrice(25000);
      expect(result).toContain("25");
      expect(result).toContain("000");
    });

    it("should format zero price", () => {
      const result = formatPrice(0);
      expect(result).toContain("0");
    });

    it("should format large price", () => {
      const result = formatPrice(1500000);
      expect(result).toContain("1.500.000");
    });

    it("should not include fraction digits", () => {
      const result = formatPrice(25000);
      expect(result).not.toContain(",00");
    });
  });

  describe("isAvailable", () => {
    it("should return true for active menu", () => {
      expect(isAvailable(createTestMenuItem({ status: "active" }))).toBe(true);
    });

    it("should return false for inactive menu", () => {
      expect(isAvailable(createTestMenuItem({ status: "inactive" }))).toBe(false);
    });
  });

  describe("getMenuBadges", () => {
    it("should return empty array when no badges", () => {
      expect(getMenuBadges(createTestMenuItem())).toEqual([]);
    });

    it("should return Popular badge", () => {
      expect(getMenuBadges(createTestMenuItem({ is_popular: true }))).toEqual(["Popular"]);
    });

    it("should return Baru badge", () => {
      expect(getMenuBadges(createTestMenuItem({ is_new: true }))).toEqual(["Baru"]);
    });

    it("should return Promo badge", () => {
      expect(getMenuBadges(createTestMenuItem({ is_promo: true }))).toEqual(["Promo"]);
    });

    it("should return multiple badges", () => {
      const badges = getMenuBadges(
        createTestMenuItem({ is_popular: true, is_new: true, is_promo: true })
      );
      expect(badges).toEqual(["Popular", "Baru", "Promo"]);
    });

    it("should return Popular + Promo badges only", () => {
      const badges = getMenuBadges(
        createTestMenuItem({ is_popular: true, is_promo: true })
      );
      expect(badges).toEqual(["Popular", "Promo"]);
    });
  });
});
