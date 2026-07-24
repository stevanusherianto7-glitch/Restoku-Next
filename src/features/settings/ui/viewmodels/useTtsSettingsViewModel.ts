import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { TtsSettings } from "@features/settings/domain/entities/TtsSettings";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useTtsSettingsViewModel() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<ApiResponse<TtsSettings>>({
    queryKey: ["settings-tts"],
    queryFn: () => apiClient.get("/api/v1/settings/tts").then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: TtsSettings) =>
      apiClient.put("/api/v1/settings/tts", payload).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings-tts"] }),
  });

  return { config: data?.data, isLoading, error, save: saveMutation.mutate };
}
