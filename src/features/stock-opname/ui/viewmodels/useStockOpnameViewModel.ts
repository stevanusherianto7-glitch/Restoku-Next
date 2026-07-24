import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { StockOpname } from "@features/stock-opname/domain/entities/StockOpname";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useStockOpnameViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<StockOpname[]>>({
    queryKey: ["stock-opname"],
    queryFn: () => apiClient.get("/api/v1/stock-opname").then((res) => res.data),
  });

  return { records: data?.data ?? [], isLoading, error, refetch };
}
