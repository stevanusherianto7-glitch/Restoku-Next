import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { OutletSettings } from "@features/settings/domain/entities/OutletSettings";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useOutletSettingsViewModel() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<ApiResponse<OutletSettings>>({
    queryKey: ["settings-outlet"],
    queryFn: () => apiClient.get("/api/v1/settings/outlet").then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: OutletSettings) =>
      apiClient.put("/api/v1/settings/outlet", payload).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings-outlet"] }),
  });

  return { settings: data?.data, isLoading, error, save: saveMutation.mutate };
}
