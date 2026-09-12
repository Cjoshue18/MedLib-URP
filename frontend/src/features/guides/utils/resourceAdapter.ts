import { MedicalDatabase } from '../data/databasesData';
import { ResourceApiDto } from '../types/resourceApiTypes';

export const mapApiResourceToMedicalDatabase = (dto: ResourceApiDto): MedicalDatabase => {
  return {
    id: `db-${dto.id}`,
    title: dto.name,
    description: dto.clinicalDescription || 'Recurso de información biomédica suscrito o seleccionado por la FAMURP.',
    accessType: dto.isSubscription ? 'Suscripción URP' : 'Acceso Abierto',
    logoFile: dto.logoUrl || '',
    accessUrl: dto.externalUrl || 'https://intranet.urp.edu.pe',
    isFeatured: dto.isSubscription,
    hasMobileApp: dto.hasMobileApp,
    tutorialUrl: dto.tutorial?.youtubeVideoId
      ? `https://www.youtube.com/watch?v=${dto.tutorial.youtubeVideoId}`
      : undefined,
    tags: dto.subjects && dto.subjects.length > 0 ? dto.subjects : ['Medicina Humana'],
  };
};
