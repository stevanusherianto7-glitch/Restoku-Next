import { describe, it, expect } from "vitest";
import {
  formatPrice,
  createCategoryId,
  createMenuId,
  isAvailable,
  getMenuBadges,
} from "../entities/MenuItem";

describe("MenuItem Entity", () => {
  describe("formatPrice", () => {
    it("should format price in Indonesian Rupiah", () => {
      expect(formatPrice(25000)).toContain("25");
      expect(formatPrice(100000)).toContain("100");
      expect(formatPrice(1500000)).toContain("1.500");
    });

    it("should handle zero price", () => {
      expect(formatPrice(0)).toContain("0");
    });
  });

  describe("createCategoryId", () => {
    it("should create branded category id", () => {
      const id = createCategoryId("cat-123");
      expect(id).toBe("cat-123");
    });
  });

  describe("createMenuId", () => {
    it("should create branded menu id", () => {
      const id = createMenuId("menu-456");
      expect(id).toBe("menu-456");
    });
  });

  describe("isAvailable", () => {
    it("should return true for active menu", () => {
      const menu = {
        id: "menu-1" as ReturnType<typeof createMenuId>,
        name: "Nasi Goreng",
        description: "Nasi goreng spesial",
        price: 25000,
        category_id: "cat-1" as ReturnType<typeof createCategoryId>,
        category: "makanan" as const,
        image_url: null,
        status: "active" as const,
        is_popular: false,
        is_new: false,
        is_promo: false,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      expect(isAvailable(menu)).toBe(true);
    });

    it("should return false for inactive menu", () => {
      const menu = {
        id: "menu-1" as ReturnType<typeof createMenuId>,
        name: "Nasi Goreng",
        description: "Nasi goreng spesial",
        price: 25000,
        category_id: "cat-1" as ReturnType<typeof createCategoryId>,
        category: "makanan" as const,
        image_url: null,
        status: "inactive" as const,
        is_popular: false,
        is_new: false,
        is_promo: false,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      expect(isAvailable(menu)).toBe(false);
    });
  });

  describe("getMenuBadges", () => {
    it("should return badges for menu with flags", () => {
      const menu = {
        id: "menu-1" as ReturnType<typeof createMenuId>,
        name: "Nasi Goreng",
        description: "Nasi goreng spesial",
        price: 25000,
        category_id: "cat-1" as ReturnType<typeof createCategoryId>,
        category: "makanan" as const,
        image_url: null,
        status: "active" as const,
        is_popular: true,
        is_new: true,
        is_promo: false,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      expect(getMenuBadges(menu)).toContain("Popular");
      expect(getMenuBadges(menu)).toContain("Baru");
    });

    it("should return empty array for menu without flags", () => {
      const menu = {
        id: "menu-1" as ReturnType<typeof createMenuId>,
        name: "Nasi Goreng",
        description: "Nasi goreng spesial",
        price: 25000,
        category_id: "cat-1" as ReturnType<typeof createCategoryId>,
        category: "makanan" as const,
        image_url: null,
        status: "active" as const,
        is_popular: false,
        is_new: false,
        is_promo: false,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      expect(getMenuBadges(menu)).toEqual([]);
    });
  });
});
