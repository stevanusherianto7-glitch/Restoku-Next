import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { Discount, Tax } from "@features/settings/domain/entities/Discount";

interface DiscountApi {
  discounts: Discount[];
  taxes: Tax[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useDiscountsViewModel() {
  const { data, isLoading, error, refetch } = useQuery<ApiResponse<DiscountApi>>({
    queryKey: ["settings-discounts"],
    queryFn: () => apiClient.get("/api/v1/settings/discounts").then((res) => res.data),
  });

  return { discounts: data?.data.discounts ?? [], taxes: data?.data.taxes ?? [], isLoading, error, refetch };
}
