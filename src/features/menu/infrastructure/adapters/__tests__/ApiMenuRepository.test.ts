import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiMenuRepository } from "../ApiMenuRepository";

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

  beforeEach(() => {
    repo = new ApiMenuRepository();
    vi.clearAllMocks();
  });

  describe("findAll", () => {
    it("should fetch menus with filters in URL", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: {
          data: [{ id: "1", name: "Nasi Goreng" }],
          meta: { current_page: 1, per_page: 20, total: 1, total_pages: 1 },
        },
      });

      const result = await repo.findAll({ search: "nasi" }, { page: 1, per_page: 20 });

      expect(apiClient.get).toHaveBeenCalledWith("/menus?page=1&per_page=20&search=nasi");
      expect(result.data).toHaveLength(1);
    });

    it("should handle category filter", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], meta: { current_page: 1, per_page: 20, total: 0, total_pages: 0 } },
      });

      await repo.findAll({ category: "makanan" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createCategoryId> }, { page: 1, per_page: 20 });

      expect(apiClient.get).toHaveBeenCalledWith("/menus?page=1&per_page=20&category=makanan");
    });

    it("should handle status filter", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: [], meta: { current_page: 1, per_page: 20, total: 0, total_pages: 0 } },
      });

      await repo.findAll({ status: "active" }, { page: 1, per_page: 20 });

      expect(apiClient.get).toHaveBeenCalledWith("/menus?page=1&per_page=20&status=active");
    });
  });

  describe("findById", () => {
    it("should fetch single menu", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { data: { id: "1", name: "Nasi Goreng" } },
      });

      const result = await repo.findById("1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>);

      expect(apiClient.get).toHaveBeenCalledWith("/menus/1");
      expect(result?.name).toBe("Nasi Goreng");
    });

    it("should return null on 404", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      const error = new Error("Not Found");
      Object.assign(error, { response: { status: 404 } });
      vi.mocked(apiClient.get).mockRejectedValue(error);

      const result = await repo.findById("999" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create new menu", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      const input = { name: "Nasi Goreng", price: 25000 };
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { data: { id: "1", ...input } },
      });

      const result = await repo.create(input as Parameters<typeof repo.create>[0]);

      expect(apiClient.post).toHaveBeenCalledWith("/menus", input);
      expect(result.name).toBe("Nasi Goreng");
    });
  });

  describe("delete", () => {
    it("should delete menu", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.delete).mockResolvedValue({});

      await repo.delete("1" as ReturnType<typeof import("@features/menu/domain/entities/MenuItem").createMenuId>);

      expect(apiClient.delete).toHaveBeenCalledWith("/menus/1");
    });
  });
});
