import { authService } from '../../auth';
import { getApiBase } from '../../../core/apiConfig';

export interface SubscribeNewsletterRequest {
  correoInstitucional: string;
  nivelAcademico: string;
}

export interface SubscribeNewsletterResponse {
  message: string;
  id: number;
  isNew: boolean;
}

export interface NewsletterStats {
  totalSuscriptores: number;
  pregrado: number;
  posgrado: number;
  residentado: number;
  docente: number;
  otro: number;
}

export interface SubscriberItem {
  idSuscriptor: number;
  correoInstitucional: string;
  nivelAcademico: string;
  fechaSuscripcion: string;
  estadoActivo: boolean;
}

export const newsletterService = {
  async subscribe(correoInstitucional: string, nivelAcademico: string): Promise<SubscribeNewsletterResponse> {
    const response = await fetch(`${getApiBase()}/api/v1/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correoInstitucional: correoInstitucional.trim(),
        nivelAcademico,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al procesar la suscripción al boletín.');
    }

    return await response.json();
  },

  async getStats(): Promise<NewsletterStats> {
    const response = await fetch(`${getApiBase()}/api/v1/newsletter/stats`);
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas de suscriptores.');
    }
    return await response.json();
  },

  async getSubscribers(q?: string, nivel?: string): Promise<SubscriberItem[]> {
    const params = new URLSearchParams();
    if (q?.trim()) params.append('q', q.trim());
    if (nivel?.trim()) params.append('nivel', nivel.trim());
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const response = await authService.authenticatedFetch(
      `${getApiBase()}/api/v1/admin/newsletter/subscribers${queryString}`
    );
    if (!response.ok) {
      throw new Error('Error al obtener la lista de suscriptores.');
    }
    return await response.json();
  },

  async deleteSubscriber(idSuscriptor: number): Promise<void> {
    const response = await authService.authenticatedFetch(
      `${getApiBase()}/api/v1/admin/newsletter/subscribers/${idSuscriptor}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al eliminar suscriptor.');
    }
  },

  async syncFromConferences(): Promise<{ message: string; nuevosSuscriptores: number; totalAnalizados: number }> {
    const response = await authService.authenticatedFetch(
      `${getApiBase()}/api/v1/admin/newsletter/sync-conferences`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al sincronizar correos de conferencias.');
    }

    return await response.json();
  },
};
