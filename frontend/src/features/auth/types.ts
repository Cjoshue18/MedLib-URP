export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  fullName: string;
  role: string;
  expiresAt: string;
  refreshExpiresAt: string;
}

export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  refreshExpiresAt: string;
}

export interface AdminUserProfile {
  id: number;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
