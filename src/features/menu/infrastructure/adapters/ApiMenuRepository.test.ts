import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiMenuRepository } from "@features/menu/infrastructure/adapters/ApiMenuRepository";
import type { MenuId } from "@features/menu/domain/entities/MenuItem";

const mockMenuResponse = {
  id: "menu-1",
  name: "Nasi Goreng",
  description: "Spesial",
  price: 25000,
  category_id: "cat-1",
  category: "makanan",
  image_url: null,
  status: "active",
  is_popular: true,
  is_new: false,
  is_promo: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

// Mock apiClient
vi.mock("@shared/infrastructure/http/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("ApiMenuRepository", () => {
  let repo: ApiMenuRepository;

  beforeEach(async () => {
    repo = new ApiMenuRepository();
    vi.clearAllMocks();
  });

  describe("findAll", () => {
    it("should fetch menus with filters and pagination", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          success: true,
          data: [mockMenuResponse],
          meta: { current_page: 1, per_page: 20, total: 1, total_pages: 1 },
        },
      });

      const result = await repo.findAll(
        { search: "nasi", category: "cat-1" as import("@features/menu/domain/entities/MenuItem").CategoryId },
        { page: 1, per_page: 20 }
      );

      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("search=nasi"));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("category=cat-1"));
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.name).toBe("Nasi Goreng");
    });

    it("should provide default meta when missing", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { success: true, data: [] },
      });

      const result = await repo.findAll({}, { page: 2, per_page: 10 });

      expect(result.meta.current_page).toBe(2);
      expect(result.meta.per_page).toBe(10);
      expect(result.meta.total).toBe(0);
    });

    it("should include status and is_popular filters", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { success: true, data: [], meta: { current_page: 1, per_page: 20, total: 0, total_pages: 0 } },
      });

      await repo.findAll({ status: "active", is_popular: true }, { page: 1, per_page: 20 });

      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("status=active"));
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining("is_popular=true"));
    });
  });

  describe("findById", () => {
    it("should return mapped menu item", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { success: true, data: mockMenuResponse },
      });

      const result = await repo.findById("menu-1" as MenuId);

      expect(result?.id).toBe("menu-1");
      expect(result?.is_popular).toBe(true);
    });

    it("should return null for 404", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockRejectedValue({
        response: { status: 404 },
      });

      const result = await repo.findById("nonexistent" as MenuId);

      expect(result).toBeNull();
    });

    it("should re-throw non-404 errors", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockRejectedValue(new Error("Server Error"));

      await expect(repo.findById("menu-1" as MenuId)).rejects.toThrow("Server Error");
    });
  });

  describe("create", () => {
    it("should post menu data and return mapped result", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { success: true, data: mockMenuResponse },
      });

      const createData = { name: mockMenuResponse.name, description: mockMenuResponse.description, price: mockMenuResponse.price, category_id: mockMenuResponse.category_id, category: mockMenuResponse.category, image_url: mockMenuResponse.image_url, status: mockMenuResponse.status, is_popular: mockMenuResponse.is_popular, is_new: mockMenuResponse.is_new, is_promo: mockMenuResponse.is_promo };
      const result = await repo.create(createData as Parameters<typeof repo.create>[0]);

      expect(apiClient.post).toHaveBeenCalledWith("/menus", createData);
      expect(result.name).toBe("Nasi Goreng");
    });
  });

  describe("update", () => {
    it("should put menu data and return mapped result", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.put).mockResolvedValue({
        data: { success: true, data: { ...mockMenuResponse, price: 30000 } },
      });

      const result = await repo.update("menu-1" as MenuId, { price: 30000 });

      expect(apiClient.put).toHaveBeenCalledWith("/menus/menu-1", { price: 30000 });
      expect(result.price).toBe(30000);
    });
  });

  describe("delete", () => {
    it("should call delete endpoint", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.delete).mockResolvedValue({});

      await repo.delete("menu-1" as MenuId);

      expect(apiClient.delete).toHaveBeenCalledWith("/menus/menu-1");
    });
  });

  describe("findPublicByRestaurant", () => {
    it("should fetch public menus by restaurant id", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { success: true, data: [mockMenuResponse] },
      });

      const result = await repo.findPublicByRestaurant("rest-1");

      expect(apiClient.get).toHaveBeenCalledWith("/public/menu/rest-1");
      expect(result).toHaveLength(1);
    });
  });
});
