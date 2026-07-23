import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { RestaurantTable, TableId } from "@features/tables/domain/entities/RestaurantTable";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useTableViewModel(restaurantId: string) {
  const queryClient = useQueryClient();

  const { data: tables, isLoading, error } = useQuery({
    queryKey: ["tables", restaurantId],
    queryFn: () =>
      apiClient
        .get<ApiResponse<RestaurantTable[]>>(`/restaurants/${restaurantId}/tables`)
        .then((res) => res.data.data),
    enabled: !!restaurantId,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; number: number }) =>
      apiClient
        .post<ApiResponse<RestaurantTable>>(`/restaurants/${restaurantId}/tables`, data)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: TableId) =>
      apiClient.delete(`/restaurants/${restaurantId}/tables/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables", restaurantId] });
    },
  });

  const generateQrMutation = useMutation({
    mutationFn: (tableIds: TableId[]) =>
      apiClient
        .post<ApiResponse<{ tableId: TableId; qrUrl: string }[]>>(
          `/restaurants/${restaurantId}/tables/qr`,
          { table_ids: tableIds }
        )
        .then((res) => res.data.data),
  });

  return {
    tables: tables || [],
    isLoading,
    error,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createTable: createMutation.mutateAsync,
    deleteTable: deleteMutation.mutateAsync,
    generateQr: generateQrMutation.mutateAsync,
  };
}
