import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTask, deleteTask, listTasks } from '../src/task-api';

const fetchMock = vi.fn<typeof fetch>();
const task = {
  id: '67112bfe47963b2be12c43b1', title: 'Estudiar Backend',
  status: 'pending', createdAt: '2026-10-01T00:00:00Z', updatedAt: '2026-10-01T00:00:00Z',
};
beforeEach(() => { vi.stubGlobal('fetch', fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); fetchMock.mockReset(); });
describe('Adaptador CRUD React', () => {
  it('envía paginación, filtros y Bearer', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: [task], meta: {
      page: 2, limit: 5, total: 6, totalPages: 2, hasNextPage: false, hasPreviousPage: true,
    } }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    const result = await listTasks({
      page: 2, limit: 5, sortBy: 'title', order: 'asc', status: 'pending', search: 'estudiar',
    }, 'token-prueba');
    expect(result.data).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('page=2');
    expect(String(url)).toContain('status=pending');
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer token-prueba');
  });
  it('crea tarea enviando JSON', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ data: task }), {
      status: 201, headers: { 'Content-Type': 'application/json' },
    }));
    const result = await createTask(task.title, 'token-prueba');
    expect(result.title).toBe(task.title);
    const [, init] = fetchMock.mock.calls[0];
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ title: task.title }));
  });
  it('acepta respuesta 204 sin JSON al eliminar', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(deleteTask(task.id, 'token-prueba')).resolves.toBeUndefined();
    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
  });
});
