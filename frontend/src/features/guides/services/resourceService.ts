import { authService } from '../../auth/services/authService';
import {
  ResourceApiDto,
  SubjectApiDto,
  CreateResourceApiRequest,
  UpdateResourceApiRequest,
} from '../types/resourceApiTypes';

const getApiBase = (): string => {
  return ((import.meta.env.VITE_API_URL || import.meta.env.API_URL) as string)?.replace(/\/$/, '') || '';
};

export const resourceService = {
  async getResources(): Promise<ResourceApiDto[]> {
    const response = await fetch(`${getApiBase()}/api/v1/resources`);
    if (!response.ok) {
      throw new Error(`Error al obtener recursos: ${response.statusText}`);
    }
    return await response.json();
  },

  async getResourceById(id: number): Promise<ResourceApiDto> {
    const response = await fetch(`${getApiBase()}/api/v1/resources/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener recurso con ID ${id}`);
    }
    return await response.json();
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
};
