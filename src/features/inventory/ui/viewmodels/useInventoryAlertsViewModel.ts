import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { InventoryAlert } from "@features/inventory/domain/entities/InventoryAlert";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useInventoryAlertsViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<InventoryAlert[]>>({
    queryKey: ["inventory-alerts"],
    queryFn: () => apiClient.get("/api/v1/inventory/alerts").then((res) => res.data),
  });

  return { alerts: data?.data ?? [], isLoading, error, refetch };
}
