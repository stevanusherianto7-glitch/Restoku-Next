import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { GoogleReview } from "@features/reviews/domain/entities/GoogleReview";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function useReviewsViewModel() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<ApiResponse<GoogleReview[]>>({
    queryKey: ["reviews"],
    queryFn: () => apiClient.get("/api/v1/reviews").then((res) => res.data),
  });

  const replyMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.post(`/api/v1/reviews/${id}/reply`, {}).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });

  return { reviews: data?.data ?? [], isLoading, error, reply: replyMutation.mutate };
}
