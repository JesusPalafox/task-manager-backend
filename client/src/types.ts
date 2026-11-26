export type TaskStatus = 'pending' | 'completed';
export interface User {
  id: string; name: string; email: string; role: 'user' | 'admin';
  createdAt: string; updatedAt: string;
}
export interface Task {
  id: string; title: string; status: TaskStatus; createdAt: string; updatedAt: string;
}
export interface ApiError {
  error?: { code?: string; message?: string; requestId?: string };
}
export interface ApiData<T> { data: T }
export interface TaskMeta {
  page: number; limit: number; total: number; totalPages: number;
  hasNextPage: boolean; hasPreviousPage: boolean;
}
export interface TaskList { data: Task[]; meta: TaskMeta }
export interface TaskQuery {
  page: number; limit: number; status?: TaskStatus;
  search?: string; sortBy: 'title' | 'status' | 'createdAt' | 'updatedAt';
  order: 'asc' | 'desc';
}
