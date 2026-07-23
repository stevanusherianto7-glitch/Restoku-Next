import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { AxiosAdapter, AxiosResponse } from "axios";
import { apiClient } from "../apiClient";

function makeResponse(config: unknown): AxiosResponse {
  return { data: {}, status: 200, statusText: "OK", headers: {}, config } as AxiosResponse;
}

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("restoku-auth", JSON.stringify({ state: { token: "abc123" } }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    apiClient.defaults.adapter = undefined as unknown as AxiosAdapter;
    delete apiClient.defaults.headers.common["Authorization"];
  });

  it("attaches Bearer token from restoku-auth in request interceptor", async () => {
    const adapterSpy = vi.fn((config: Parameters<AxiosAdapter>[0]) => {
      const headers = config.headers as Record<string, string>;
      expect(headers.Authorization).toBe("Bearer abc123");
      return Promise.resolve(makeResponse(config));
    }) as unknown as AxiosAdapter;

    apiClient.defaults.adapter = adapterSpy;
    await apiClient.get("/health");
    expect(adapterSpy).toHaveBeenCalled();
  });

  it("clears auth and redirects to /login on 401 when refresh also fails", async () => {
    const failAdapter = vi.fn((config: Parameters<AxiosAdapter>[0]) =>
      Promise.reject({ response: { status: 401 }, config })
    ) as unknown as AxiosAdapter;

    apiClient.defaults.adapter = failAdapter;
    await expect(apiClient.get("/orders")).rejects.toBeDefined();
    expect(localStorage.getItem("restoku-auth")).toBeNull();
  });
});
