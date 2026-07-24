import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { Supplier } from "@features/suppliers/domain/entities/Supplier";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useSuppliersViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<Supplier[]>>({
    queryKey: ["suppliers"],
    queryFn: () => apiClient.get("/api/v1/suppliers").then((res) => res.data),
  });

  return { suppliers: data?.data ?? [], isLoading, error, refetch };
}
