import type { AxiosError } from "axios";

export class ValidationError extends Error {
  details: Record<string, string[]>;
  constructor(details: Record<string, string[]>) {
    super("Validation failed");
    this.name = "ValidationError";
    this.details = details;
  }
}

export class RateLimitError extends Error {
  retryAfter: number;
  constructor(retryAfter: number) {
    super("Too many requests. Please try again later.");
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  retry_after?: number;
}

/**
 * Maps an Axios error to a domain error with an Indonesian message.
 * Contract: INTEGRATION-PLAN.md §4 (Error Handling Strategy).
 */
export function handleApiError(error: AxiosError<{ error: ApiError }>): never {
  const status = error.response?.status;
  const apiError = error.response?.data?.error;

  switch (status) {
    case 401:
      throw new Error("Sesi telah berakhir. Silakan login kembali.");
    case 403:
      throw new Error("Anda tidak memiliki akses ke fitur ini.");
    case 404:
      throw new Error("Data tidak ditemukan.");
    case 422:
      throw new ValidationError(apiError?.details ?? {});
    case 429:
      throw new RateLimitError(apiError?.retry_after ?? 60);
    default:
      throw new Error(apiError?.message ?? "Terjadi kesalahan. Silakan coba lagi.");
  }
}
