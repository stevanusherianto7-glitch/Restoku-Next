import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMenuList,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  getPublicMenu,
} from "../menuUseCases";
import type { MenuRepository } from "../../ports/MenuRepository";
import type { PaginatedResult } from "../../ports/MenuRepository";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";

describe("menuUseCases", () => {
  const mockRepository: MenuRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findPublicByRestaurant: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMenuList", () => {
    it("should return paginated menus", async () => {
      const mockResult: PaginatedResult<MenuItem> = {
        data: [{ id: "1" as MenuItem["id"], name: "Nasi Goreng", description: null, price: 25000, category_id: "cat-1" as MenuItem["category_id"], category: "makanan", image_url: null, status: "active", is_popular: false, is_new: false, is_promo: false, created_at: "2024-01-01", updated_at: "2024-01-01" }],
        meta: { current_page: 1, per_page: 20, total: 1, total_pages: 1 },
      };
      vi.mocked(mockRepository.findAll).mockResolvedValue(mockResult);

      const result = await getMenuList({}, { page: 1, per_page: 20 }, { menuRepository: mockRepository });

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("getMenuById", () => {
    it("should return menu by id", async () => {
      const mockMenu: MenuItem = { id: "1" as MenuItem["id"], name: "Nasi Goreng", description: null, price: 25000, category_id: "cat-1" as MenuItem["category_id"], category: "makanan", image_url: null, status: "active", is_popular: false, is_new: false, is_promo: false, created_at: "2024-01-01", updated_at: "2024-01-01" };
      vi.mocked(mockRepository.findById).mockResolvedValue(mockMenu);

      const result = await getMenuById("1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: mockRepository });

      expect(result).toEqual(mockMenu);
    });

    it("should return null if not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      const result = await getMenuById("999" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: mockRepository });

      expect(result).toBeNull();
    });
  });

  describe("createMenu", () => {
    it("should create new menu", async () => {
      const input = {
        name: "Nasi Goreng",
        price: 25000,
        category_id: "cat-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createCategoryId>,
        category: "makanan" as const,
        status: "active" as const,
        description: "Nasi goreng spesial",
        image_url: null,
        is_popular: false,
        is_new: false,
        is_promo: false,
      };
      const mockCreated: MenuItem = { id: "1" as MenuItem["id"], ...input, created_at: "2024-01-01", updated_at: "2024-01-01" };
      vi.mocked(mockRepository.create).mockResolvedValue(mockCreated);

      const result = await createMenu(input, { menuRepository: mockRepository });

      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockCreated);
    });

    it("should throw error if name is empty", async () => {
      const input = {
        name: "",
        price: 25000,
        category_id: "cat-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createCategoryId>,
        category: "makanan" as const,
        status: "active" as const,
        description: null,
        image_url: null,
        is_popular: false,
        is_new: false,
        is_promo: false,
      };

      await expect(
        createMenu(input, { menuRepository: mockRepository })
      ).rejects.toThrow("Menu name is required");
    });

    it("should throw error if price is negative", async () => {
      const input = {
        name: "Nasi Goreng",
        price: -1000,
        category_id: "cat-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createCategoryId>,
        category: "makanan" as const,
        status: "active" as const,
        description: null,
        image_url: null,
        is_popular: false,
        is_new: false,
        is_promo: false,
      };

      await expect(
        createMenu(input, { menuRepository: mockRepository })
      ).rejects.toThrow("Price cannot be negative");
    });
  });

  describe("updateMenu", () => {
    it("should update existing menu", async () => {
      const existing: MenuItem = { id: "1" as MenuItem["id"], name: "Nasi Goreng", description: null, price: 25000, category_id: "cat-1" as MenuItem["category_id"], category: "makanan", image_url: null, status: "active", is_popular: false, is_new: false, is_promo: false, created_at: "2024-01-01", updated_at: "2024-01-01" };
      vi.mocked(mockRepository.findById).mockResolvedValue(existing);
      vi.mocked(mockRepository.update).mockResolvedValue({ ...existing, name: "Updated" });

      const result = await updateMenu(
        "1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>,
        { name: "Updated" },
        { menuRepository: mockRepository }
      );

      expect(result.name).toBe("Updated");
    });

    it("should throw error if menu not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(
        updateMenu("999" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { name: "Updated" }, { menuRepository: mockRepository })
      ).rejects.toThrow("Menu not found");
    });
  });

  describe("deleteMenu", () => {
    it("should delete existing menu", async () => {
      const existing: MenuItem = { id: "1" as MenuItem["id"], name: "Nasi Goreng", description: null, price: 25000, category_id: "cat-1" as MenuItem["category_id"], category: "makanan", image_url: null, status: "active", is_popular: false, is_new: false, is_promo: false, created_at: "2024-01-01", updated_at: "2024-01-01" };
      vi.mocked(mockRepository.findById).mockResolvedValue(existing);
      vi.mocked(mockRepository.delete).mockResolvedValue(undefined);

      await deleteMenu("1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: mockRepository });

      expect(mockRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw error if menu not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(
        deleteMenu("999" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: mockRepository })
      ).rejects.toThrow("Menu not found");
    });
  });

  describe("getPublicMenu", () => {
    it("should return public menu for restaurant", async () => {
      const mockMenus: MenuItem[] = [{ id: "1" as MenuItem["id"], name: "Nasi Goreng", description: null, price: 25000, category_id: "cat-1" as MenuItem["category_id"], category: "makanan", image_url: null, status: "active", is_popular: false, is_new: false, is_promo: false, created_at: "2024-01-01", updated_at: "2024-01-01" }];
      vi.mocked(mockRepository.findPublicByRestaurant).mockResolvedValue(mockMenus);

      const result = await getPublicMenu("rest-1", { menuRepository: mockRepository });

      expect(mockRepository.findPublicByRestaurant).toHaveBeenCalledWith("rest-1");
      expect(result).toEqual(mockMenus);
    });
  });
});
