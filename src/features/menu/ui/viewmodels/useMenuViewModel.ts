import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import type { MenuItem, MenuId } from "@features/menu/domain/entities/MenuItem";
import type { MenuFilters, PaginationParams } from "@features/menu/application/ports/MenuRepository";
import { ApiMenuRepository } from "@features/menu/infrastructure/adapters/ApiMenuRepository";
import {
  getMenuList,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "@features/menu/application/use-cases/menuUseCases";

const menuRepository = new ApiMenuRepository();

export function useMenuViewModel() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MenuFilters>({});
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    per_page: 20,
  });

  // Query: List menus
  const {
    data: menuList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menus", filters, pagination],
    queryFn: () => getMenuList(filters, pagination, { menuRepository }),
  });

  // Query: Get single menu
  const useMenuById = (id: MenuId) => {
    return useQuery({
      queryKey: ["menu", id],
      queryFn: () => getMenuById(id, { menuRepository }),
      enabled: !!id,
    });
  };

  // Mutation: Create menu
  const createMutation = useMutation({
    mutationFn: (data: Omit<MenuItem, "id" | "created_at" | "updated_at">) =>
      createMenu(data, { menuRepository }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  // Mutation: Update menu
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: MenuId;
      data: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>;
    }) => updateMenu(id, data, { menuRepository }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  // Mutation: Delete menu
  const deleteMutation = useMutation({
    mutationFn: (id: MenuId) => deleteMenu(id, { menuRepository }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  // Computed values
  const menus = useMemo(() => menuList?.data || [], [menuList]);
  const meta = useMemo(() => menuList?.meta, [menuList]);
  const totalPages = useMemo(() => meta?.total_pages || 0, [meta]);

  // Actions
  const updateFilters = (newFilters: Partial<MenuFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
    setPagination({ page: 1, per_page: 20 });
  };

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    // Data
    menus,
    meta,
    totalPages,
    filters,
    pagination,

    // States
    isLoading,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Actions
    updateFilters,
    clearFilters,
    goToPage,
    useMenuById,
    createMenu: createMutation.mutateAsync,
    updateMenu: updateMutation.mutateAsync,
    deleteMenu: deleteMutation.mutateAsync,
  };
}
