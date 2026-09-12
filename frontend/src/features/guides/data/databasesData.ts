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
  tags: string[];
}

export type BiomedicalDatabase = MedicalDatabase;

export const getDatabaseLogoUrl = (logoFile?: string | null): string => {
  if (!logoFile) return '';
  if (logoFile.startsWith('http://') || logoFile.startsWith('https://')) {
    return logoFile;
  }
  if (logoFile.startsWith('/api/v1/')) {
    const apiBase = (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
    return `${apiBase}${logoFile}`;
  }
  return `/logos/${logoFile}`;
};
