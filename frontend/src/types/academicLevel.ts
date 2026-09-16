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
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    case 'Posgrado':
      return 'bg-blue-50 text-blue-800 border-blue-300';
    case 'Residentado':
      return 'bg-amber-50 text-amber-800 border-amber-300';
    case 'Docente':
      return 'bg-purple-50 text-purple-800 border-purple-300';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-300';
  }
};
