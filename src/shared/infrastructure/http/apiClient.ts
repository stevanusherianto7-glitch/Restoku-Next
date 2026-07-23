import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { handleApiError } from "./errorHandler";

interface ApiErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const stored = localStorage.getItem("restoku-auth");
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: silent refresh on 401, then map errors to domain errors
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // No config (e.g. network error) — reject directly
    if (!original) {
      return Promise.reject(handleApiError(error));
    }

    if (error.response?.status === 401 && !original._retry) {
      // Never try to refresh using the refresh endpoint itself — that would
      // recurse infinitely. Also skip when the original call was the refresh.
      const isRefreshCall = (original.url ?? "").includes("/auth/refresh");
      if (isRefreshCall) {
        localStorage.removeItem("restoku-auth");
        return Promise.reject(handleApiError(error));
      }

      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await apiClient.post(
            "/auth/refresh",
            {},
            { withCredentials: true }
          );
          const newToken = data.data.token as string;
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          isRefreshing = false;
          pendingQueue.forEach((cb) => cb(newToken));
          pendingQueue = [];
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        } catch {
          isRefreshing = false;
          pendingQueue.forEach((cb) => cb(null));
          pendingQueue = [];
          localStorage.removeItem("restoku-auth");
          window.location.href = "/login";
          return Promise.reject(handleApiError(error));
        }
      }

      // Another request is already refreshing — wait for it
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          } else {
            reject(handleApiError(error));
          }
        });
      });
    }

    return Promise.reject(handleApiError(error));
  }
);
