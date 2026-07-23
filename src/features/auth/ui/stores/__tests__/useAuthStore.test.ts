import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "../useAuthStore";

vi.mock("@shared/infrastructure/http/apiClient", () => ({
  apiClient: {
    post: vi.fn(),
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

  it("should have initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set user and token on login", async () => {
    const { apiClient } = await import("@shared/infrastructure/http/apiClient");
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        data: {
          user: { id: "1", name: "Test", email: "test@test.com", role: "owner", restaurantId: "r1", tenant_id: "t1", outlet_id: null },
          token: "token123",
        },
      },
    });

    await useAuthStore.getState().login("test@test.com", "password123");

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe("token123");
    expect(state.user?.name).toBe("Test");
  });

  it("should clear state on logout", async () => {
    const { apiClient } = await import("@shared/infrastructure/http/apiClient");
    vi.mocked(apiClient.post).mockResolvedValue({});

    useAuthStore.setState({ isAuthenticated: true, token: "token123" });
    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it("should set error on login failure", async () => {
    const { apiClient } = await import("@shared/infrastructure/http/apiClient");
    vi.mocked(apiClient.post).mockRejectedValue(new Error("Invalid credentials"));

    await expect(
      useAuthStore.getState().login("test@test.com", "wrong")
    ).rejects.toThrow();

    expect(useAuthStore.getState().error).toBe("Invalid credentials");
  });

  it("should clear error", () => {
    useAuthStore.setState({ error: "Some error" });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
