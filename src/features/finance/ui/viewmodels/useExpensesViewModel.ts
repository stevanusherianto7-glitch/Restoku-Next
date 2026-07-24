import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { Expense } from "@features/finance/domain/entities/Expense";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useExpensesViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<Expense[]>>({
    queryKey: ["expenses"],
    queryFn: () => apiClient.get("/api/v1/expenses").then((res) => res.data),
  });

  const expenses = data?.data ?? [];
  const totalThisMonth = expenses.reduce((s, e) => s + e.amount, 0);

  return { expenses, totalThisMonth, isLoading, error, refetch };
}
