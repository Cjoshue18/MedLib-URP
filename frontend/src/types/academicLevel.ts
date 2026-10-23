export type AcademicLevel = 'Pregrado' | 'Posgrado' | 'Residentado' | 'Docente' | 'Otro';

export const ACADEMIC_LEVELS: readonly AcademicLevel[] = [
  'Pregrado',
  'Posgrado',
  'Residentado',
  'Docente',
  'Otro',
] as const;

export type AcademicLevelFilter = 'todos' | AcademicLevel;

export const ACADEMIC_LEVEL_FILTERS: readonly AcademicLevelFilter[] = [
  'todos',
  ...ACADEMIC_LEVELS,
] as const;

export const normalizeAcademicLevel = (raw?: string | null): AcademicLevel => {
  if (!raw) return 'Otro';
  const clean = raw.trim().toLowerCase();

  switch (clean) {
    case 'pregrado':
    case 'estudiante':
      return 'Pregrado';
    case 'posgrado':
    case 'postgrado':
      return 'Posgrado';
    case 'residentado':
      return 'Residentado';
    case 'docente':
    case 'profesor':
      return 'Docente';
    default:
      return 'Otro';
  }
};

export const getAcademicLevelBadgeClass = (level: string): string => {
  switch (level) {
    case 'Pregrado':
      return 'bg-white text-[#008744] border-[#008744]/30';
    case 'Posgrado':
      return 'bg-white text-slate-800 border-slate-300';
    case 'Residentado':
      return 'bg-white text-slate-800 border-slate-300';
    case 'Docente':
      return 'bg-white text-slate-800 border-slate-300';
    default:
      return 'bg-white text-slate-700 border-slate-200';
  }
};
