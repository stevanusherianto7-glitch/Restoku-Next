import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { PrinterConfig } from "@features/settings/domain/entities/PrinterConfig";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function usePrinterSettingsViewModel() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<ApiResponse<PrinterConfig>>({
    queryKey: ["settings-printer"],
    queryFn: () => apiClient.get("/api/v1/settings/printer").then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: PrinterConfig) =>
      apiClient.put("/api/v1/settings/printer", payload).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings-printer"] }),
  });

  return { config: data?.data, isLoading, error, save: saveMutation.mutate };
}
