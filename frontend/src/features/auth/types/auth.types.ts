export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  token: string;
  expiresAtUtc?: string;
}

export interface UserSession {
  username: string;
  token: string;
  expiresAtUtc?: string;
}

export interface AuthContextType {
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}
