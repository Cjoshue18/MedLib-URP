import { authService } from '../../auth/services/authService';
import {
  ResourceApiDto,
  SubjectApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../types/resourceApiTypes';

const getApiBase = (): string => {
  return (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
};

const resourceDetailCache = new Map<number, ResourceApiDto>();

export const resourceService = {
  async getResources(lite: boolean = false): Promise<ResourceApiDto[]> {
    const url = lite ? `${getApiBase()}/api/v1/resources?lite=true` : `${getApiBase()}/api/v1/resources`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener recursos: ${response.statusText}`);
    }
    return await response.json();
  },

  async getAdminResources(): Promise<ResourceApiDto[]> {
    const token = authService.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${getApiBase()}/api/v1/admin/resources`, { headers });
      if (!response.ok) {
        return await this.getResources();
      }
      return await response.json();
    } catch {
      return await this.getResources();
    }
  },

  async getResourceById(id: number): Promise<ResourceApiDto> {
    const cached = resourceDetailCache.get(id);
    if (cached) {
      return cached;
    }
    const response = await fetch(`${getApiBase()}/api/v1/resources/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener recurso con ID ${id}`);
    }
    const data = await response.json();
    resourceDetailCache.set(id, data);
    return data;
  },

  clearDetailCache(id?: number): void {
    if (id !== undefined) {
      resourceDetailCache.delete(id);
    } else {
      resourceDetailCache.clear();
    }
  },

  async getSubjects(): Promise<SubjectApiDto[]> {
    const response = await fetch(`${getApiBase()}/api/v1/subjects`);
    if (!response.ok) {
      throw new Error(`Error al obtener materias: ${response.statusText}`);
    }
    return await response.json();
  },

  async createResource(request: CreateResourceApiRequest): Promise<ResourceApiDto> {
    const token = authService.getToken();
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al crear recurso' }));
      throw new Error(err.message || 'Error al crear recurso');
    }

    return await response.json();
  },

  async updateResource(id: number, request: UpdateResourceApiRequest): Promise<ResourceApiDto> {
    const token = authService.getToken();
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al actualizar recurso' }));
      throw new Error(err.message || 'Error al actualizar recurso');
    }

    this.clearDetailCache(id);
    return await response.json();
  },

  async deleteResource(id: number): Promise<void> {
    const token = authService.getToken();
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al eliminar recurso' }));
      throw new Error(err.message || 'Error al eliminar recurso');
    }

    this.clearDetailCache(id);
  },

  async uploadLogo(file: File): Promise<string> {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/upload-logo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al subir imagen del logo' }));
      throw new Error(err.message || 'Error al subir imagen del logo');
    }

    const data = await response.json();
    return data.logoUrl;
  },

  async toggleHexagonDisplay(id: number): Promise<ResourceApiDto> {
    const token = authService.getToken();
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/${id}/toggle-hexagonos`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al cambiar visibilidad en hexágonos' }));
      throw new Error(err.message || 'Error al cambiar visibilidad en hexágonos');
    }

    this.clearDetailCache(id);
    return await response.json();
  },

  async setHexagonMatrix(resourceIds: number[]): Promise<ResourceApiDto[]> {
    const token = authService.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${getApiBase()}/api/v1/admin/resources/hexagon-matrix`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ resourceIds }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Error al actualizar matriz de hexágonos' }));
      throw new Error(err.message || 'Error al actualizar matriz de hexágonos');
    }

    this.clearDetailCache();
    return await response.json();
  },
};
