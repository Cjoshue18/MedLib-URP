import { AdminNavigationItem } from '../types';

export const ADMIN_NAVIGATION_ITEMS: readonly AdminNavigationItem[] = [
  {
    id: 'databases',
    label: 'Bases de Datos',
    sublabel: 'Bases de Datos Médicas',
    description: 'Catálogo general y matriz hexagonal',
  },
  {
    id: 'lost-found',
    label: 'Instagram',
    sublabel: 'Publicaciones de Instagram',
    description: 'Objetos perdidos y avisos de sala',
  },
  {
    id: 'conferences',
    label: 'Conferencias',
    sublabel: 'Conferencias',
    description: 'Talleres, eventos y control de asistencia',
  },
  {
    id: 'statistics',
    label: 'Estadísticas',
    sublabel: 'Estadísticas y Reportes',
    description: 'Cruce de asistencias y exportación Excel',
  },
] as const;
