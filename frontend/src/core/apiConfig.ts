export const getApiBase = (): string => {
  return (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '';
};
