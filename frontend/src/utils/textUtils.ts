export const normalizeText = (str?: string | null): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const matchesSearchQuery = (source?: string | null, query?: string | null): boolean => {
  if (!query) return true;
  if (!source) return false;
  return normalizeText(source).includes(normalizeText(query));
};
