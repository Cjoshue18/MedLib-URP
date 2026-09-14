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

export const lostFoundService = {
  async getPosts(): Promise<LostItemPost[]> {
    const response = await fetch(`${getApiBase()}/api/v1/lost-items`);
    if (!response.ok) {
      throw new Error('Error al cargar publicaciones de objetos perdidos.');
    }
    return await response.json();
  },

  async createPost(urlInstagram: string): Promise<LostItemPost> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/lost-items`, {
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
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/lost-items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al eliminar la publicación.');
    }
  },
};
