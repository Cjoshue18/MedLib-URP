import { authService } from '../../auth/services/authService';

export interface LostItemPost {
  id: number;
  urlInstagram: string;
  fechaCreacion: string;
}

export interface CreateLostItemPostRequest {
  urlInstagram: string;
}

const getApiBase = (): string => {
  return (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
};

const authenticatedFetch = async (input: string, init: RequestInit = {}): Promise<Response> => {
  const token = await authService.getValidToken();
  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    const refreshedToken = await authService.refreshToken();
    if (refreshedToken) {
      headers.set('Authorization', `Bearer ${refreshedToken}`);
      response = await fetch(input, { ...init, headers });
    }
  }

  return response;
};

export const lostFoundService = {
  async getPosts(): Promise<LostItemPost[]> {
    const response = await fetch(`${getApiBase()}/api/lost-items`);
    if (!response.ok) {
      throw new Error('Error al cargar publicaciones de objetos perdidos.');
    }
    return await response.json();
  },

  async createPost(urlInstagram: string): Promise<LostItemPost> {
    const response = await authenticatedFetch(`${getApiBase()}/api/lost-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urlInstagram }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al registrar la publicación en Instagram.');
    }

    return await response.json();
  },

  async deletePost(id: number): Promise<void> {
    const response = await authenticatedFetch(`${getApiBase()}/api/lost-items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al eliminar la publicación.');
    }
  },
};
