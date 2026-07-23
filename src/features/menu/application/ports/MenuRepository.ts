import type { MenuItem, MenuId, CategoryId } from "@features/menu/domain/entities/MenuItem";

export interface MenuFilters {
  category?: CategoryId;
  search?: string;
  status?: "active" | "inactive";
  is_popular?: boolean;
}

export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface MenuRepository {
  findAll(
    filters: MenuFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<MenuItem>>;

  findById(id: MenuId): Promise<MenuItem | null>;

  create(
    data: Omit<MenuItem, "id" | "created_at" | "updated_at">
  ): Promise<MenuItem>;

  update(
    id: MenuId,
    data: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>
  ): Promise<MenuItem>;

  delete(id: MenuId): Promise<void>;

  findPublicByRestaurant(
    restaurantId: string
  ): Promise<MenuItem[]>;
}
