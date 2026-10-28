export interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  description: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    src: '/carousel/20260910_210323.webp',
    alt: 'Espacio de estudio y lectura - Biblioteca FMH URP',
    titlePrefix: 'Un lugar para',
    titleHighlight: 'pensar',
    titleSuffix: 'en profundidad.',
    description: 'Encuentra el espacio ideal para concentrarte. Un ambiente tranquilo, equipado con amplias mesas y sillas diseñadas para optimizar tus largas jornadas de estudio.',
  },
  {
    id: 'slide-2',
    src: '/carousel/20260910_210341.webp',
    alt: 'Equipos de cómputo y tecnología - Biblioteca FMH URP',
    titlePrefix: 'Herramientas',
    titleHighlight: 'digitales',
    titleSuffix: 'para tu formación.',
    description: 'Accede libremente a equipos modernos y conexión de alta velocidad, complementados con las aplicaciones necesarias para tus trabajos universitarios.',
  },
  {
    id: 'slide-3',
    src: '/carousel/20260910_210422.webp',
    alt: 'Colección de libros y préstamo bibliográfico - Biblioteca FMH URP',
    titlePrefix: 'Una colección',
    titleHighlight: 'completa',
    titleSuffix: 'a tu disposición.',
    description: 'Respalda tu aprendizaje clínico con nuestra amplia variedad de libros físicos. Desde ciencias básicas hasta las patologías más complejas, todo lo que necesitas está aquí.',
  },
];
