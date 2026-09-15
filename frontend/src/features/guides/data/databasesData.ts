import { getApiBase } from '../../../core/apiConfig';

export type AccessType = 'Suscripción URP' | 'Acceso Abierto';

export interface MedicalDatabase {
  id: string;
  rawId?: number;
  title: string;
  description: string;
  accessType: AccessType;
  logoFile: string;
  accessUrl: string;
  isFeatured?: boolean;
  hasMobileApp?: boolean;
  tutorialUrl?: string;
  mostrarEnHexagonos?: boolean;
  tags: string[];
}

export const getDatabaseLogoUrl = (logoFile?: string | null): string => {
  if (!logoFile) return '';
  if (logoFile.startsWith('http://') || logoFile.startsWith('https://')) {
    return logoFile;
  }
  if (logoFile.startsWith('/api/v1/')) {
    return `${getApiBase()}${logoFile}`;
  }
  return `/logos/${logoFile}`;
};
