import { LoginRequest, LoginResponse, TokenRefreshResponse, AdminUserProfile } from '../types';

const TOKEN_KEY = 'medlib_urp_admin_token';
const REFRESH_TOKEN_KEY = 'medlib_urp_admin_refresh_token';
const USER_KEY = 'medlib_urp_admin_user';

let refreshPromise: Promise<string | null> | null = null;

const getApiBase = (): string => {
  return (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
};

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${getApiBase()}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de autenticación' }));
      throw new Error(errorData.message || 'Error de autenticación');
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  isTokenExpired(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.expiresAt) return true;
    const expirationTime = new Date(user.expiresAt).getTime();
    return Number.isNaN(expirationTime) || Date.now() >= expirationTime;
  },

  isRefreshTokenExpired(): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.refreshExpiresAt) return true;
    const expirationTime = new Date(user.refreshExpiresAt).getTime();
    return Number.isNaN(expirationTime) || Date.now() >= expirationTime;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getCurrentUser(): LoginResponse | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  async refreshToken(): Promise<string | null> {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      const currentRefreshToken = this.getRefreshToken();
      if (!currentRefreshToken || this.isRefreshTokenExpired()) {
        this.logout();
        return null;
      }

      try {
        const response = await fetch(`${getApiBase()}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: currentRefreshToken }),
        });

        if (!response.ok) {
          this.logout();
          return null;
        }

        const data: TokenRefreshResponse = await response.json();
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

        const currentUser = this.getCurrentUser();
        if (currentUser) {
          currentUser.token = data.token;
          currentUser.refreshToken = data.refreshToken;
          currentUser.expiresAt = data.expiresAt;
          currentUser.refreshExpiresAt = data.refreshExpiresAt;
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        }

        return data.token;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  },

  async getValidToken(): Promise<string | null> {
    if (!this.isTokenExpired()) {
      const token = this.getToken();
      if (token) return token;
    }
    return await this.refreshToken();
  },

  async verifyProfile(): Promise<AdminUserProfile | null> {
    const token = await this.getValidToken();
    if (!token) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(`${getApiBase()}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        const newToken = await this.refreshToken();
        if (!newToken) {
          this.logout();
          return null;
        }

        const retryResponse = await fetch(`${getApiBase()}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (!retryResponse.ok) {
          this.logout();
          return null;
        }

        return await retryResponse.json();
      }

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  },

  logout(): void {
    const currentRefreshToken = this.getRefreshToken();
    if (currentRefreshToken) {
      fetch(`${getApiBase()}/api/v1/auth/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      }).catch(() => {});
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    if (!token && !refreshToken) {
      return false;
    }
    if (this.isTokenExpired() && this.isRefreshTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  },
};
