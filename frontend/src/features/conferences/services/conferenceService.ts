import { authService } from '../../auth/services/authService';
import { 
  ConferenceSummary, 
  CreateConferenceRequest, 
  UpdateConferenceRequest, 
  RegisterParticipantRequest, 
  MarkAttendanceRequest, 
  ConferenceReport 
} from '../types';

const getApiBase = (): string => {
  return (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
};

export const conferenceService = {
  async getConferences(desde?: string, hasta?: string): Promise<ConferenceSummary[]> {
    const params = new URLSearchParams();
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${getApiBase()}/api/v1/conferences${qs}`);
    if (!response.ok) {
      throw new Error('Error al cargar la agenda de conferencias.');
    }
    return await response.json();
  },

  async getConferenceById(id: number): Promise<ConferenceSummary> {
    const response = await fetch(`${getApiBase()}/api/v1/conferences/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener los detalles de la conferencia.');
    }
    return await response.json();
  },

  async registerParticipant(id: number, data: RegisterParticipantRequest): Promise<{ message: string }> {
    const response = await fetch(`${getApiBase()}/api/v1/conferences/${id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Error al procesar la pre-inscripción.');
    }
    return body;
  },

  async markAttendance(id: number, data: MarkAttendanceRequest): Promise<{ message: string }> {
    const response = await fetch(`${getApiBase()}/api/v1/conferences/${id}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Error al registrar la marcación de asistencia.');
    }
    return body;
  },

  async getAdminConferences(): Promise<ConferenceSummary[]> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences`);
    if (!response.ok) {
      throw new Error('Error al cargar conferencias en el panel de administración.');
    }
    return await response.json();
  },

  async createConference(data: CreateConferenceRequest): Promise<ConferenceSummary> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Error al crear la conferencia.');
    }
    return body;
  },

  async updateConference(id: number, data: UpdateConferenceRequest): Promise<ConferenceSummary> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Error al actualizar la conferencia.');
    }
    return body;
  },

  async toggleAttendance(id: number): Promise<{ idConferencia: number; asistenciaAbierta: boolean; message: string }> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences/${id}/toggle-attendance`, {
      method: 'PATCH'
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Error al conmutar la apertura de asistencia.');
    }
    return body;
  },

  async togglePurge(id: number): Promise<{ idConferencia: number; autoPurgar30Dias: boolean; message: string }> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences/${id}/toggle-purge`, {
      method: 'PATCH'
    });

    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message || 'Error al conmutar la política de purga.');
    }
    return body;
  },

  async getConferenceReport(id: number): Promise<ConferenceReport> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences/${id}/report`);
    if (!response.ok) {
      throw new Error('Error al obtener el reporte cruzado de asistencias.');
    }
    return await response.json();
  },

  async deleteConference(id: number): Promise<void> {
    const response = await authService.authenticatedFetch(`${getApiBase()}/api/v1/admin/conferences/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || 'Error al eliminar la conferencia.');
    }
  }
};
