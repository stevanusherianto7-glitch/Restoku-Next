import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { OutletComparison } from "@features/outlet/domain/entities/OutletComparison";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useOutletComparisonViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<OutletComparison[]>>({
    queryKey: ["outlet-comparison"],
    queryFn: () => apiClient.get("/api/v1/outlets/comparison").then((res) => res.data),
  });

  return { outlets: data?.data ?? [], isLoading, error, refetch };
}
