import type { MenuItem, MenuId } from "@features/menu/domain/entities/MenuItem";
import type { MenuRepository, MenuFilters, PaginationParams, PaginatedResult } from "@features/menu/application/ports/MenuRepository";

export async function getMenuList(
  filters: MenuFilters,
  pagination: PaginationParams,
  deps: { menuRepository: MenuRepository }
): Promise<PaginatedResult<MenuItem>> {
  return deps.menuRepository.findAll(filters, pagination);
}

export async function getMenuById(
  id: MenuId,
  deps: { menuRepository: MenuRepository }
): Promise<MenuItem | null> {
  return deps.menuRepository.findById(id);
}

export async function createMenu(
  data: Omit<MenuItem, "id" | "created_at" | "updated_at">,
  deps: { menuRepository: MenuRepository }
): Promise<MenuItem> {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error("Menu name is required");
  }

  if (data.price < 0) {
    throw new Error("Price cannot be negative");
  }

  return deps.menuRepository.create(data);
}

export async function updateMenu(
  id: MenuId,
  data: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>,
  deps: { menuRepository: MenuRepository }
): Promise<MenuItem> {
  const existing = await deps.menuRepository.findById(id);
  if (!existing) {
    throw new Error("Menu not found");
  }

  if (data.price !== undefined && data.price < 0) {
    throw new Error("Price cannot be negative");
  }

  return deps.menuRepository.update(id, data);
}

export async function deleteMenu(
  id: MenuId,
  deps: { menuRepository: MenuRepository }
): Promise<void> {
  const existing = await deps.menuRepository.findById(id);
  if (!existing) {
    throw new Error("Menu not found");
  }

  return deps.menuRepository.delete(id);
}

export async function getPublicMenu(
  restaurantId: string,
  deps: { menuRepository: MenuRepository }
): Promise<MenuItem[]> {
  return deps.menuRepository.findPublicByRestaurant(restaurantId);
}
