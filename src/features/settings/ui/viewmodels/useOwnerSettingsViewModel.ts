import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { OwnerSettings } from "@features/settings/domain/entities/OwnerSettings";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useOwnerSettingsViewModel() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<ApiResponse<OwnerSettings>>({
    queryKey: ["owner-settings"],
    queryFn: () => apiClient.get("/api/v1/owner/settings").then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: OwnerSettings) =>
      apiClient.put("/api/v1/owner/settings", payload).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["owner-settings"] }),
  });

  return { settings: data?.data, isLoading, error, save: saveMutation.mutate };
}
