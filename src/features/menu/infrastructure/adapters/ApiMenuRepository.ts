import type { MenuItem, MenuId } from "../../domain/entities/MenuItem";
import type { MenuRepository, MenuFilters, PaginationParams, PaginatedResult } from "../../application/ports/MenuRepository";
import { apiClient } from "@shared/infrastructure/http/apiClient";

interface MenuItemResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  category: string;
  image_url: string | null;
  status: string;
  is_popular: boolean;
  is_new: boolean;
  is_promo: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

function mapToMenuItem(response: MenuItemResponse): MenuItem {
  return {
    id: response.id as MenuId,
    name: response.name,
    description: response.description,
    price: response.price,
    category_id: response.category_id as import("../../domain/entities/MenuItem").CategoryId,
    category: response.category as import("../../domain/entities/MenuItem").MenuCategory,
    image_url: response.image_url,
    status: response.status as import("../../domain/entities/MenuItem").MenuStatus,
    is_popular: response.is_popular,
    is_new: response.is_new,
    is_promo: response.is_promo,
    created_at: response.created_at,
    updated_at: response.updated_at,
  };
}

export class ApiMenuRepository implements MenuRepository {
  async findAll(
    filters: MenuFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<MenuItem>> {
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("per_page", pagination.per_page.toString());

    if (filters.category) {
      params.append("category", filters.category);
    }
    if (filters.search) {
      params.append("search", filters.search);
    }
    if (filters.status) {
      params.append("status", filters.status);
    }
    if (filters.is_popular !== undefined) {
      params.append("is_popular", filters.is_popular.toString());
    }

    const response = await apiClient.get<ApiResponse<MenuItemResponse[]>>(
      `/menus?${params.toString()}`
    );

    return {
      data: response.data.data.map(mapToMenuItem),
      meta: response.data.meta || {
        current_page: pagination.page,
        per_page: pagination.per_page,
        total: 0,
        total_pages: 0,
      },
    };
  }

  async findById(id: MenuId): Promise<MenuItem | null> {
    try {
      const response = await apiClient.get<ApiResponse<MenuItemResponse>>(
        `/menus/${id}`
      );
      return mapToMenuItem(response.data.data);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response === "object" &&
        (error as { response: { status?: number } }).response?.status === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  async create(
    data: Omit<MenuItem, "id" | "created_at" | "updated_at">
  ): Promise<MenuItem> {
    const response = await apiClient.post<ApiResponse<MenuItemResponse>>(
      "/menus",
      data
    );
    return mapToMenuItem(response.data.data);
  }

  async update(
    id: MenuId,
    data: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>
  ): Promise<MenuItem> {
    const response = await apiClient.put<ApiResponse<MenuItemResponse>>(
      `/menus/${id}`,
      data
    );
    return mapToMenuItem(response.data.data);
  }

  async delete(id: MenuId): Promise<void> {
    await apiClient.delete(`/menus/${id}`);
  }

  async findPublicByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    const response = await apiClient.get<ApiResponse<MenuItemResponse[]>>(
      `/public/menu/${restaurantId}`
    );
    return response.data.data.map(mapToMenuItem);
  }
}
