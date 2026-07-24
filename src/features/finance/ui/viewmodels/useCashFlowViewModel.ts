import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { CashFlowEntry } from "@features/finance/domain/entities/CashFlowEntry";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useCashFlowViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<CashFlowEntry[]>>({
    queryKey: ["cash-flow"],
    queryFn: () => apiClient.get("/api/v1/cash-flow").then((res) => res.data),
  });

  const entries = data?.data ?? [];
  const totalIn = entries.filter((e) => e.type === "in").reduce((s, e) => s + e.amount, 0);
  const totalOut = entries.filter((e) => e.type === "out").reduce((s, e) => s + e.amount, 0);

  return { entries, totalIn, totalOut, balance: totalIn - totalOut, isLoading, error, refetch };
}
