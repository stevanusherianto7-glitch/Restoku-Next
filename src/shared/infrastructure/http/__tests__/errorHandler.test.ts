import { describe, it, expect } from "vitest";
import { handleApiError, ValidationError, RateLimitError } from "../errorHandler";
import type { AxiosError } from "axios";

interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  retry_after?: number;
}

function fakeAxios(status: number, apiError?: ApiErrorBody): AxiosError<{ error: ApiErrorBody }> {
  return {
    response: { status, data: { error: apiError } },
  } as AxiosError<{ error: ApiErrorBody }>;
}

describe("handleApiError", () => {
  it("maps 422 to ValidationError with details", () => {
    expect(() =>
      handleApiError(fakeAxios(422, { code: "VALIDATION_ERROR", message: "invalid", details: { email: ["required"] } }))
    ).toThrow(ValidationError);
  });

  it("maps 429 to RateLimitError with retry_after", () => {
    let caught: unknown;
    try {
      handleApiError(fakeAxios(429, { code: "RATE_LIMIT", message: "slow down", retry_after: 30 }));
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(RateLimitError);
    expect((caught as RateLimitError).retryAfter).toBe(30);
  });

  it("maps 403 to akses ditolak", () => {
    expect(() => handleApiError(fakeAxios(403))).toThrow(/akses/);
  });

  it("maps 404 to data tidak ditemukan", () => {
    expect(() => handleApiError(fakeAxios(404))).toThrow(/tidak ditemukan/);
  });

  it("maps unknown status to generic message", () => {
    expect(() => handleApiError(fakeAxios(500, { code: "SERVER", message: "boom" }))).toThrow(/boom/);
  });
});
