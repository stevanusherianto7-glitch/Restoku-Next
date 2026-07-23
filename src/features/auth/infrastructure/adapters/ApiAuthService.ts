import type { AuthCredentials, AuthResponse, AuthService } from "@features/auth/application/ports/AuthService";
import { apiClient } from "@shared/infrastructure/http/apiClient";

/**
 * HTTP adapter for authentication. Uses the shared axios `apiClient`
 * (base URL VITE_API_URL, defaults to .../api/v1) so that the request
 * interceptor attaches the Bearer token and the 401 refresh logic applies
 * uniformly. This avoids a second fetch-based HTTP stack (INTEGRATION-PLAN §3).
 */
export class ApiAuthService implements AuthService {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/auth/login",
      credentials
    );
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: { token: string } }>(
      "/auth/refresh",
      {},
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
    );
    return { token: response.data.data.token } as AuthResponse;
  }

  async getCurrentUser(): Promise<import("@features/auth/domain/entities/User").User | null> {
    try {
      const response = await apiClient.get<{
        data: import("@features/auth/domain/entities/User").User;
      }>("/auth/me");
      return response.data.data;
    } catch {
      return null;
    }
  }
}
