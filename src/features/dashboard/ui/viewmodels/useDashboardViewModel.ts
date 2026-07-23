import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { DashboardData } from "@features/dashboard/domain/entities/Dashboard";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useDashboardViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<DashboardData>>({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.get("/dashboard").then((res) => res.data),
    refetchInterval: 30000, // Refresh setiap 30 detik
  });

  return {
    dashboard: data?.data,
    isLoading,
    error,
    refetch,
  };
}
