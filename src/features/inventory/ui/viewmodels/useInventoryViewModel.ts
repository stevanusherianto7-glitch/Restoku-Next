import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { InventoryItem } from "@features/inventory/domain/entities/InventoryItem";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useInventoryViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<InventoryItem[]>>({
    queryKey: ["inventory"],
    queryFn: () => apiClient.get("/api/v1/inventory").then((res) => res.data),
  });

  const items = data?.data ?? [];
  const lowStock = items.filter((i) => i.stock <= i.minStock).length;

  return { items, lowStock, isLoading, error, refetch };
}
