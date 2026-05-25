// Cliente HTTP minimal. Centraliza BASE_URL, paginación y HTTP Basic Auth.
// El backend usa Spring Security HTTP Basic; las credenciales se guardan
// en sessionStorage tras un login exitoso (ver AuthContext).

export const BASE = import.meta.env.VITE_BACKEND_BASE_URL;
export const PAGE_SIZE = 20;

const AUTH_KEY = 'basicAuth';

export function getStoredAuth() {
  return sessionStorage.getItem(AUTH_KEY);
}

export function setStoredAuth(encoded) {
  sessionStorage.setItem(AUTH_KEY, encoded);
}

export function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function encodeBasic(username, password) {
  return btoa(`${username}:${password}`);
}

export function authHeader() {
  const creds = getStoredAuth();
  return creds ? { Authorization: `Basic ${creds}` } : {};
}

// Llamada API con auth automática. Si el backend responde 401,
// limpia las creds y redirige al login (la sesión expiró o son inválidas).
export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401) {
    clearStoredAuth();
    if (!window.location.pathname.endsWith('/login')) {
      window.location.href = '/login';
    }
    throw new Error('No autorizado');
  }
  return res;
}
