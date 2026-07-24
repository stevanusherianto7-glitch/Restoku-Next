import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { InventoryDashboard } from "@features/inventory/domain/entities/InventoryDashboard";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useInventoryDashboardViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<InventoryDashboard>>({
    queryKey: ["inventory-dashboard"],
    queryFn: () => apiClient.get("/api/v1/inventory/dashboard").then((res) => res.data),
  });

  return { dashboard: data?.data, isLoading, error, refetch };
}
