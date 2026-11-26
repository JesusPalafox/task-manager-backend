import type { ApiData, ApiError, TaskList, User } from './types';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
export async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('No fue posible comunicarse con la API. Comprueba el servidor y CORS.');
  }
  const text = await response.text();
  let body: unknown;
  try { body = text ? JSON.parse(text) : undefined; } catch { throw new Error('La API devolvió una respuesta no JSON.'); }
  if (!response.ok) {
    const error = body as ApiError | undefined;
    throw new Error(error?.error?.message || `Error HTTP ${response.status}`);
  }
  return body as T;
}
export async function register(name: string, email: string, password: string): Promise<User> {
  const result = await request<ApiData<{ user: User }>>('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ name, email, password }),
  });
  return result.data.user;
}
export async function login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
  const result = await request<ApiData<{ user: User; accessToken: string }>>(
    '/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) },
  );
  return result.data;
}
export async function getMe(token: string): Promise<User> {
  return (await request<ApiData<{ user: User }>>('/api/auth/me', {}, token)).data.user;
}
export function listTasks(token: string): Promise<TaskList> {
  return request<TaskList>('/api/tasks?page=1&limit=10', {}, token);
}
