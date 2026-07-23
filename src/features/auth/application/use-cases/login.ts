import type { AuthCredentials, AuthResponse, AuthService } from "../ports/AuthService";

export async function login(
  credentials: AuthCredentials,
  deps: { authService: AuthService }
): Promise<AuthResponse> {
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }

  return deps.authService.login(credentials);
}

export async function logout(deps: { authService: AuthService }): Promise<void> {
  return deps.authService.logout();
}
