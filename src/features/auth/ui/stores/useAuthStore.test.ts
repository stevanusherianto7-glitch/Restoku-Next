import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@features/auth/ui/stores/useAuthStore";
import type { User } from "@features/auth/domain/entities/User";
import { createUserId } from "@shared/domain/types";

vi.mock("@shared/infrastructure/http/apiClient", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    localStorage.clear();
  });

  describe("initial state", () => {
    it("should start with null user and token", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("login", () => {
    it("should set user and token on successful login", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.post).mockResolvedValue({
        data: {
          success: true,
          data: {
            user: { id: "u1", name: "Admin", email: "a@b.com", role: "owner", restaurant_id: "r1", tenant_id: "t1", outlet_id: null },
            token: "jwt-abc",
          },
        },
      });

      await useAuthStore.getState().login("a@b.com", "password");

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.email).toBe("a@b.com");
      expect(state.token).toBe("jwt-abc");
    });

    it("should set isLoading during login", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      let resolveLogin!: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => { resolveLogin = resolve; });
      vi.mocked(apiClient.post).mockReturnValue(loginPromise as never);

      const loginExec = useAuthStore.getState().login("a@b.com", "pass");
      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveLogin({
        data: {
          success: true,
          data: { user: { id: "u1", name: "A", email: "a@b.com", role: "owner", restaurant_id: "r1", tenant_id: "t1", outlet_id: null }, token: "t" },
        },
      });
      await loginExec;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("should persist token via zustand persist middleware", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.post).mockResolvedValue({
        data: {
          success: true,
          data: {
            user: { id: "u1", name: "A", email: "a@b.com", role: "owner", restaurant_id: "r1", tenant_id: "t1", outlet_id: null },
            token: "jwt-stored",
          },
        },
      });

      await useAuthStore.getState().login("a@b.com", "pass");

      const stored = localStorage.getItem("restoku-auth");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.state.token).toBe("jwt-stored");
    });

    it("should set Authorization header on apiClient", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.post).mockResolvedValue({
        data: {
          success: true,
          data: {
            user: { id: "u1", name: "A", email: "a@b.com", role: "owner", restaurant_id: "r1", tenant_id: "t1", outlet_id: null },
            token: "jwt-header",
          },
        },
      });

      await useAuthStore.getState().login("a@b.com", "pass");

      expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer jwt-header");
    });

    it("should set error on failed login", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.post).mockRejectedValue(new Error("Invalid credentials"));

      await expect(useAuthStore.getState().login("a@b.com", "wrong")).rejects.toThrow();

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Invalid credentials");
    });
  });

  describe("logout", () => {
    it("should clear user, token and authentication state", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      vi.mocked(apiClient.post).mockResolvedValue({
        data: {
          success: true,
          data: {
            user: { id: "u1", name: "A", email: "a@b.com", role: "owner", restaurant_id: "r1", tenant_id: "t1", outlet_id: null },
            token: "jwt",
          },
        },
      });
      await useAuthStore.getState().login("a@b.com", "pass");

      vi.mocked(apiClient.post).mockResolvedValue({});

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("should remove Authorization header", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      apiClient.defaults.headers.common["Authorization"] = "Bearer old";

      vi.mocked(apiClient.post).mockResolvedValue({});
      await useAuthStore.getState().logout();

      expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
    });

    it("should still clear state even if logout API fails", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      const user: User = {
        id: createUserId("u1"),
        name: "A",
        email: "a@b.com",
        role: "owner",
        restaurantId: "r1",
        tenant_id: "t1",
        outlet_id: null,
      };
      useAuthStore.setState({ user, token: "t", isAuthenticated: true });
      vi.mocked(apiClient.post).mockRejectedValue(new Error("Network error"));

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("refreshToken", () => {
    it("should update token on successful refresh", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      useAuthStore.setState({ token: "old-token", isAuthenticated: true });

      vi.mocked(apiClient.post).mockResolvedValue({
        data: {
          success: true,
          data: { token: "new-refreshed-jwt" },
        },
      });

      await useAuthStore.getState().refreshToken();

      expect(useAuthStore.getState().token).toBe("new-refreshed-jwt");
      expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer new-refreshed-jwt");
    });

    it("should trigger logout if refreshToken fails", async () => {
      const { apiClient } = await import("@shared/infrastructure/http/apiClient");
      useAuthStore.setState({ token: "old-token", isAuthenticated: true });

      vi.mocked(apiClient.post).mockRejectedValue(new Error("Refresh failed"));

      await useAuthStore.getState().refreshToken();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(useAuthStore.getState().token).toBeNull();
    });
  });

  describe("setUser", () => {
    it("should set user directly", () => {
      const user: User = {
        id: createUserId("u1"),
        name: "Admin",
        email: "a@b.com",
        role: "owner",
        restaurantId: "r1",
        tenant_id: "t1",
        outlet_id: null,
      };
      useAuthStore.getState().setUser(user);

      expect(useAuthStore.getState().user?.name).toBe("Admin");
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      useAuthStore.setState({ error: "Some error" });
      useAuthStore.getState().clearError();

      expect(useAuthStore.getState().error).toBeNull();
    });
  });
});
