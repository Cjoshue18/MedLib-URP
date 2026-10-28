export interface BentoCollectionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  isExternal: boolean;
  type: 'books' | 'journals' | 'theses';
}

export const BENTO_COLLECTIONS: BentoCollectionItem[] = [
  {
    id: 'books',
    title: 'Libros',
    description: 'Colección completa de libros disponibles para consulta de ejemplares y posterior préstamo en biblioteca.',
    href: 'https://biblioteca.urp.edu.pe/abnopac/',
    isExternal: true,
    type: 'books',
  },
  {
    id: 'journals',
    title: 'Revistas',
    description: 'Artículos de investigación en medicina y salud pública con revisión por pares y de acceso abierto. Disponible a texto completo en español e inglés.',
    href: 'https://revistas.urp.edu.pe/index.php/RFMH',
    isExternal: true,
    type: 'journals',
  },
  {
    id: 'theses',
    title: 'Tesis',
    description: 'Tesis de bachiller, pregrado, posgrado e investigaciones de la Facultad de Medicina Humana.',
    href: 'https://hdl.handle.net/20.500.14138/26',
    isExternal: true,
    type: 'theses',
  },
];
