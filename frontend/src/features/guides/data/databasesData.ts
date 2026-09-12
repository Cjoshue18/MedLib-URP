export type AccessType = 'Suscripción URP' | 'Acceso Abierto';

export interface MedicalDatabase {
  id: string;
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

export const getDatabaseLogoUrl = (logoFile?: string): string => {
  if (!logoFile) return '';
  if (logoFile.startsWith('http://') || logoFile.startsWith('https://')) {
    return logoFile;
  }
  return `/logos/${logoFile}`;
};
