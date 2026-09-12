import { LoginRequest, LoginResponse, AdminUserProfile } from '../types';

const TOKEN_KEY = 'medlib_urp_admin_token';
const USER_KEY = 'medlib_urp_admin_user';

const getApiBase = (): string => {
  return ((import.meta.env.VITE_API_URL || import.meta.env.API_URL) as string)?.replace(/\/$/, '') || '';
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
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
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

  async verifyProfile(): Promise<AdminUserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${getApiBase()}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      return await response.json();
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
