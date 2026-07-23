import { describe, it, expect, vi } from "vitest";
import { login, logout } from "@features/auth/application/use-cases/login";
import type { AuthService, AuthCredentials, AuthResponse } from "@features/auth/application/ports/AuthService";
import { createUserId } from "@shared/domain/types";

function createMockAuthService(overrides: Partial<AuthService> = {}): AuthService {
  return {
    login: vi.fn().mockResolvedValue({
      user: {
        id: createUserId("user-1"),
        name: "Admin",
        email: "admin@restoku.com",
        role: "owner",
        restaurantId: "rest-1",
      },
      token: "jwt-token-abc",
      refreshToken: "refresh-token-xyz",
    } as AuthResponse),
    logout: vi.fn().mockResolvedValue(undefined),
    refreshToken: vi.fn().mockResolvedValue({} as AuthResponse),
    getCurrentUser: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}

describe("Auth Use Cases", () => {
  describe("login", () => {
    it("should call authService.login with valid credentials", async () => {
      const mockService = createMockAuthService();
      const credentials: AuthCredentials = {
        email: "admin@restoku.com",
        password: "password",
      };

      const result = await login(credentials, { authService: mockService });

      expect(mockService.login).toHaveBeenCalledWith(credentials);
      expect(result.token).toBe("jwt-token-abc");
      expect(result.user.email).toBe("admin@restoku.com");
    });

    it("should throw if email is empty", async () => {
      const mockService = createMockAuthService();

      await expect(
        login({ email: "", password: "pass" }, { authService: mockService })
      ).rejects.toThrow("Email and password are required");

      expect(mockService.login).not.toHaveBeenCalled();
    });

    it("should throw if password is empty", async () => {
      const mockService = createMockAuthService();

      await expect(
        login({ email: "a@b.com", password: "" }, { authService: mockService })
      ).rejects.toThrow("Email and password are required");

      expect(mockService.login).not.toHaveBeenCalled();
    });

    it("should propagate service errors", async () => {
      const mockService = createMockAuthService({
        login: vi.fn().mockRejectedValue(new Error("Invalid credentials")),
      });

      await expect(
        login({ email: "a@b.com", password: "wrong" }, { authService: mockService })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("logout", () => {
    it("should call authService.logout", async () => {
      const mockService = createMockAuthService();

      await logout({ authService: mockService });

      expect(mockService.logout).toHaveBeenCalledTimes(1);
    });

    it("should propagate service errors on logout", async () => {
      const mockService = createMockAuthService({
        logout: vi.fn().mockRejectedValue(new Error("Network error")),
      });

      await expect(logout({ authService: mockService })).rejects.toThrow("Network error");
    });
  });
});
