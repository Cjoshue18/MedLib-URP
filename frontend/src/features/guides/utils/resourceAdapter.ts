import { MedicalDatabase } from '../data/databasesData';
import { ResourceApiDto } from '../types/resourceApiTypes';

export const mapApiResourceToMedicalDatabase = (dto: ResourceApiDto): MedicalDatabase => {
  return {
    id: `db-${dto.id}`,
    rawId: dto.id,
    title: dto.name,
    description: dto.clinicalDescription || '',
    accessType: dto.isSubscription ? 'Suscripción URP' : 'Acceso Abierto',
    logoFile: dto.logoUrl || '',
    accessUrl: dto.externalUrl || 'https://intranet.urp.edu.pe',
    isFeatured: dto.isSubscription,
    hasMobileApp: dto.hasMobileApp,
    tutorialUrl: dto.tutorial?.youtubeVideoId
      ? `https://www.youtube.com/watch?v=${dto.tutorial.youtubeVideoId}`
      : undefined,
    mostrarEnHexagonos: dto.mostrarEnHexagonos ?? false,
    tags: dto.subjects && dto.subjects.length > 0 ? dto.subjects : ['Medicina Humana'],
  };
};
