import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { PnL } from "@features/finance/domain/entities/PnL";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useProfitLossViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<PnL>>({
    queryKey: ["profit-loss"],
    queryFn: () => apiClient.get("/api/v1/profit-loss").then((res) => res.data),
  });

  return { pnl: data?.data, isLoading, error, refetch };
}
