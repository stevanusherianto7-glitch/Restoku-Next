import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { Employee } from "@features/employees/domain/entities/Employee";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useEmployeesViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<Employee[]>>({
    queryKey: ["employees"],
    queryFn: () => apiClient.get("/api/v1/employees").then((res) => res.data),
  });

  return { employees: data?.data ?? [], isLoading, error, refetch };
}
