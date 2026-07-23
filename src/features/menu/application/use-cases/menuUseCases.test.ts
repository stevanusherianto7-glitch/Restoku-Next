import { describe, it, expect, vi } from "vitest";
import {
  getMenuList,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  getPublicMenu,
} from "@features/menu/application/use-cases/menuUseCases";
import type { MenuRepository, PaginatedResult } from "@features/menu/application/ports/MenuRepository";
import type { MenuItem } from "@features/menu/domain/entities/MenuItem";

const testMenuItem: MenuItem = {
  id: "menu-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>,
  name: "Nasi Goreng",
  description: "Nasi goreng spesial",
  price: 25000,
  category_id: "cat-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createCategoryId>,
  category: "makanan",
  image_url: null,
  status: "active",
  is_popular: false,
  is_new: false,
  is_promo: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function createMockRepo(overrides: Partial<MenuRepository> = {}): MenuRepository {
  return {
    findAll: vi.fn().mockResolvedValue({
      data: [testMenuItem],
      meta: { current_page: 1, per_page: 20, total: 1, total_pages: 1 },
    } as PaginatedResult<MenuItem>),
    findById: vi.fn().mockResolvedValue(testMenuItem),
    create: vi.fn().mockResolvedValue(testMenuItem),
    update: vi.fn().mockResolvedValue(testMenuItem),
    delete: vi.fn().mockResolvedValue(undefined),
    findPublicByRestaurant: vi.fn().mockResolvedValue([testMenuItem]),
    ...overrides,
  };
}

describe("Menu Use Cases", () => {
  describe("getMenuList", () => {
    it("should call repository findAll with filters and pagination", async () => {
      const repo = createMockRepo();
      const filters = { search: "nasi" };
      const pagination = { page: 1, per_page: 20 };

      const result = await getMenuList(filters, pagination, { menuRepository: repo });

      expect(repo.findAll).toHaveBeenCalledWith(filters, pagination);
      expect(result.data).toHaveLength(1);
    });
  });

  describe("getMenuById", () => {
    it("should return menu item by id", async () => {
      const repo = createMockRepo();

      const result = await getMenuById("menu-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: repo });

      expect(repo.findById).toHaveBeenCalledWith("menu-1");
      expect(result?.name).toBe("Nasi Goreng");
    });

    it("should return null for non-existent id", async () => {
      const repo = createMockRepo({ findById: vi.fn().mockResolvedValue(null) });

      const result = await getMenuById("nonexistent" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: repo });

      expect(result).toBeNull();
    });
  });

  describe("createMenu", () => {
    it("should create menu with valid data", async () => {
      const repo = createMockRepo();
      const { id, created_at, updated_at, ...data } = testMenuItem;
      void id; void created_at; void updated_at;

      const result = await createMenu(data, { menuRepository: repo });

      expect(repo.create).toHaveBeenCalledWith(data);
      expect(result.name).toBe("Nasi Goreng");
    });

    it("should throw if name is empty", async () => {
      const repo = createMockRepo();
      const { id, created_at, updated_at, ...data } = testMenuItem;
      void id; void created_at; void updated_at;

      await expect(
        createMenu({ ...data, name: "" }, { menuRepository: repo })
      ).rejects.toThrow("Menu name is required");
    });

    it("should throw if name is whitespace only", async () => {
      const repo = createMockRepo();
      const { id, created_at, updated_at, ...data } = testMenuItem;
      void id; void created_at; void updated_at;

      await expect(
        createMenu({ ...data, name: "   " }, { menuRepository: repo })
      ).rejects.toThrow("Menu name is required");
    });

    it("should throw if price is negative", async () => {
      const repo = createMockRepo();
      const { id, created_at, updated_at, ...data } = testMenuItem;
      void id; void created_at; void updated_at;

      await expect(
        createMenu({ ...data, price: -1000 }, { menuRepository: repo })
      ).rejects.toThrow("Price cannot be negative");
    });
  });

  describe("updateMenu", () => {
    it("should update existing menu", async () => {
      const repo = createMockRepo();

      await updateMenu(
        "menu-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>,
        { price: 30000 },
        { menuRepository: repo }
      );

      expect(repo.findById).toHaveBeenCalledWith("menu-1");
      expect(repo.update).toHaveBeenCalledWith("menu-1", { price: 30000 });
    });

    it("should throw if menu not found", async () => {
      const repo = createMockRepo({ findById: vi.fn().mockResolvedValue(null) });

      await expect(
        updateMenu("nonexistent" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { price: 30000 }, { menuRepository: repo })
      ).rejects.toThrow("Menu not found");
    });

    it("should throw if update price is negative", async () => {
      const repo = createMockRepo();

      await expect(
        updateMenu("menu-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { price: -500 }, { menuRepository: repo })
      ).rejects.toThrow("Price cannot be negative");
    });

    it("should allow update without price", async () => {
      const repo = createMockRepo();

      await updateMenu("menu-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { name: "Updated Name" }, { menuRepository: repo });

      expect(repo.update).toHaveBeenCalledWith("menu-1", { name: "Updated Name" });
    });
  });

  describe("deleteMenu", () => {
    it("should delete existing menu", async () => {
      const repo = createMockRepo();

      await deleteMenu("menu-1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: repo });

      expect(repo.findById).toHaveBeenCalledWith("menu-1");
      expect(repo.delete).toHaveBeenCalledWith("menu-1");
    });

    it("should throw if menu not found", async () => {
      const repo = createMockRepo({ findById: vi.fn().mockResolvedValue(null) });

      await expect(
        deleteMenu("nonexistent" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>, { menuRepository: repo })
      ).rejects.toThrow("Menu not found");
    });
  });

  describe("getPublicMenu", () => {
    it("should return public menus for restaurant", async () => {
      const repo = createMockRepo();

      const result = await getPublicMenu("rest-1", { menuRepository: repo });

      expect(repo.findPublicByRestaurant).toHaveBeenCalledWith("rest-1");
      expect(result).toHaveLength(1);
    });
  });
});
