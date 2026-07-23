import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@shared/infrastructure/http/apiClient";
import type { User } from "@features/auth/domain/entities/User";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post("/auth/login", {
            email,
            password,
          });

          const { user, token } = response.data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set token for subsequent requests
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/logout");
        } catch {
          // Ignore logout errors
        } finally {
          delete apiClient.defaults.headers.common["Authorization"];
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await apiClient.post("/auth/refresh");
          const { token } = response.data.data;

          set({ token });
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } catch {
          // If refresh fails, logout
          get().logout();
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "restoku-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Set token on rehydration
        if (state?.token) {
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
        }
      },
    }
  )
);
