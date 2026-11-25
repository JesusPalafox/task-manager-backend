export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}
export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}
export interface ApiError {
  error?: { code?: string; message?: string; requestId?: string };
}
export interface ApiData<T> { data: T }
export interface TaskList { data: Task[]; meta: { page: number; limit: number; total: number; totalPages: number } }
