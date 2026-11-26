import { request } from './api';
import type { ApiData, Task, TaskList, TaskQuery, TaskStatus } from './types';

export function listTasks(query: TaskQuery, token: string): Promise<TaskList> {
  const params = new URLSearchParams({
    page: String(query.page), limit: String(query.limit),
    sortBy: query.sortBy, order: query.order,
  });
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.status) params.set('status', query.status);
  return request<TaskList>('/api/tasks?' + params.toString(), {}, token);
}
export async function createTask(title: string, token: string): Promise<Task> {
  return (await request<ApiData<Task>>('/api/tasks', {
    method: 'POST', body: JSON.stringify({ title }),
  }, token)).data;
}
export async function editTask(id: string, changes: { title?: string; status?: TaskStatus }, token: string): Promise<Task> {
  return (await request<ApiData<Task>>('/api/tasks/' + encodeURIComponent(id), {
    method: 'PATCH', body: JSON.stringify(changes),
  }, token)).data;
}
export async function completeTask(id: string, token: string): Promise<Task> {
  return (await request<ApiData<Task>>('/api/tasks/' + encodeURIComponent(id) + '/complete', {
    method: 'PATCH',
  }, token)).data;
}
export async function deleteTask(id: string, token: string): Promise<void> {
  await request<void>('/api/tasks/' + encodeURIComponent(id), { method: 'DELETE' }, token);
}
