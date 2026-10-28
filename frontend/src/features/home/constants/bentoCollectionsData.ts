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
    description: 'Catálogo bibliográfico físico en sala y tratados clínicos en formato digital con préstamo domiciliario.',
    href: 'https://biblioteca.urp.edu.pe/abnopac/',
    isExternal: true,
    type: 'books',
  },
  {
    id: 'journals',
    title: 'Revistas',
    description: 'Hemeroteca médica con publicaciones periódicas Q1/Q2 y revistas arbitradas de salud en texto completo.',
    href: '#revistas',
    isExternal: false,
    type: 'journals',
  },
  {
    id: 'theses',
    title: 'Tesis',
    description: 'Repositorio de tesis de pregrado, posgrado y segundas especialidades médicas aprobadas en la FAMURP.',
    href: 'https://repositorio.urp.edu.pe/',
    isExternal: true,
    type: 'theses',
  },
];
