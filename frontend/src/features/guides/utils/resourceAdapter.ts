import { DatabaseCategory, MedicalDatabase } from '../data/databasesData';
import { ResourceApiDto } from '../types/resourceApiTypes';

const determineCategory = (dto: ResourceApiDto): DatabaseCategory => {
  if (!dto.isSubscription) {
    return 'Acceso Abierto';
  }

  const nameAndSubjects = `${dto.name} ${dto.subjects.join(' ')} ${dto.clinicalDescription || ''}`.toLowerCase();

  if (
    nameAndSubjects.includes('point-of-care') ||
    nameAndSubjects.includes('clínica') ||
    nameAndSubjects.includes('farmacología') ||
    nameAndSubjects.includes('consult') ||
    nameAndSubjects.includes('uptodate') ||
    nameAndSubjects.includes('dynamed')
  ) {
    return 'Herramientas Clínicas';
  }

  if (
    nameAndSubjects.includes('revista') ||
    nameAndSubjects.includes('libro') ||
    nameAndSubjects.includes('editorial') ||
    nameAndSubjects.includes('journal') ||
    nameAndSubjects.includes('e-book')
  ) {
    return 'Revistas y Libros';
  }

  if (
    nameAndSubjects.includes('scopus') ||
    nameAndSubjects.includes('wos') ||
    nameAndSubjects.includes('web of science') ||
    nameAndSubjects.includes('multidisciplinaria') ||
    nameAndSubjects.includes('proquest') ||
    nameAndSubjects.includes('ebsco')
  ) {
    return 'Multidisciplinaria';
  }

  return 'Especializada';
};

export const mapApiResourceToMedicalDatabase = (dto: ResourceApiDto): MedicalDatabase => {
  return {
    id: `db-${dto.id}`,
    title: dto.name,
    description: dto.clinicalDescription || 'Recurso de información biomédica suscrito o seleccionado por la FAMURP.',
    category: determineCategory(dto),
    accessType: dto.isSubscription ? 'Suscripción URP' : 'Acceso Abierto',
    logoFile: dto.logoUrl || '',
    accessUrl: dto.externalUrl || 'https://intranet.urp.edu.pe',
    isFeatured: dto.isSubscription,
    tutorialUrl: dto.tutorial?.youtubeVideoId
      ? `https://www.youtube.com/watch?v=${dto.tutorial.youtubeVideoId}`
      : undefined,
    tags: dto.subjects && dto.subjects.length > 0 ? dto.subjects : ['Medicina Humana'],
  };
};
