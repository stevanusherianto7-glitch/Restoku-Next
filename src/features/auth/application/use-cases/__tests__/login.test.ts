import { describe, it, expect, vi } from "vitest";
import { login, logout } from "../login";
import type { AuthService } from "../../ports/AuthService";
import { createUserId } from "@shared/domain/types";

describe("login use case", () => {
  const mockAuthService: AuthService = {
    login: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    getCurrentUser: vi.fn(),
  };

  it("should call authService.login with credentials", async () => {
    const credentials = { email: "user@example.com", password: "password123" };
    const expectedResponse = {
      user: {
        id: createUserId("1"),
        email: "user@example.com",
        name: "User",
        role: "owner" as const,
        restaurantId: "r1",
        tenant_id: "t1",
        outlet_id: null,
      },
      token: "token123",
      refreshToken: "refresh123",
    };

    vi.mocked(mockAuthService.login).mockResolvedValue(expectedResponse);

    const result = await login(credentials, { authService: mockAuthService });

    expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
    expect(result).toEqual(expectedResponse);
  });

  it("should throw error if email is empty", async () => {
    await expect(
      login({ email: "", password: "password123" }, { authService: mockAuthService })
    ).rejects.toThrow("Email and password are required");
  });

  it("should throw error if password is empty", async () => {
    await expect(
      login({ email: "user@example.com", password: "" }, { authService: mockAuthService })
    ).rejects.toThrow("Email and password are required");
  });

  it("should propagate auth service errors", async () => {
    const credentials = { email: "user@example.com", password: "wrong" };
    vi.mocked(mockAuthService.login).mockRejectedValue(new Error("Invalid credentials"));

    await expect(
      login(credentials, { authService: mockAuthService })
    ).rejects.toThrow("Invalid credentials");
  });
});

describe("logout use case", () => {
  const mockAuthService: AuthService = {
    login: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    getCurrentUser: vi.fn(),
  };

  it("should call authService.logout", async () => {
    vi.mocked(mockAuthService.logout).mockResolvedValue(undefined);

    await logout({ authService: mockAuthService });

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
