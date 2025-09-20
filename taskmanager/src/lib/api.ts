// src/lib/api.ts

// Read env and provide a safe fallback to the backend:
const rawBase = (import.meta.env.VITE_API_BASE_URL ??
  'http://localhost:8080/api') as string;

// Normalize: remove any trailing slash
const BASE = rawBase.replace(/\/+$/, '');

let AUTH_TOKEN: string | null = null;

export function setAuthToken(token: string | null) {
  AUTH_TOKEN = token;
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (AUTH_TOKEN) h['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  if (extra) Object.assign(h, extra as any);
  return h;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: authHeaders(init.headers) });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // Auto-logout on 401
    if (res.status === 401) {
      setAuthToken(null);
      // include reason so login can show a message if you want
      window.location.href = `/login?expired=1`;
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
  }
  if (res.status === 204) return null as unknown as T;
  return (await res.json()) as T;
}

export const api = {
  get:  <T>(path: string)            => request<T>(path),
  post: <T>(path: string, body: any) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:  <T>(path: string, body: any) => request<T>(path, { method: 'PUT',  body: JSON.stringify(body) }),
  del:  <T>(path: string)            => request<T>(path, { method: 'DELETE' }),
};

export function getAuthToken() {
  return AUTH_TOKEN ?? localStorage.getItem('token');
}

// Optional: one-time debug so you can see the base in DevTools
console.log('API BASE =', BASE);
