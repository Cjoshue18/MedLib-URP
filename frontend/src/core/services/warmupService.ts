import { getApiBase } from '../apiConfig';

const WARMUP_SESSION_KEY = 'medlib_urp_warmup_triggered';

export const triggerSilentWarmup = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const isWarmed = sessionStorage.getItem(WARMUP_SESSION_KEY);
    if (isWarmed) return;

    sessionStorage.setItem(WARMUP_SESSION_KEY, 'true');

    const apiBase = getApiBase();
    const endpoint = apiBase ? `${apiBase}/` : '/';

    fetch(endpoint, {
      method: 'GET',
      keepalive: true,
      cache: 'no-store',
      mode: 'cors'
    }).catch(() => {});
  } catch {
    return;
  }
};
