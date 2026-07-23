export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: import("@features/auth/domain/entities/User").User;
  token: string;
  refreshToken: string;
}

export interface AuthService {
  login(credentials: AuthCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthResponse>;
  getCurrentUser(): Promise<import("@features/auth/domain/entities/User").User | null>;
}
