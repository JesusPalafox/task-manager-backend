import type { HydratedDocument } from 'mongoose';
import { AppError } from '../errors/app-error.js';
import type {
  Task,
  TaskPersistence,
  TaskUpdate,
} from '../models/task.js';
import {
  createTaskDocument,
  deleteTaskDocument,
  findTaskDocumentById,
  findTaskDocuments,
  updateTaskDocument,
} from '../repositories/task.repository.js';
import type { TaskListQuery, TaskListResult } from '../types/task-query.js';

const toTask = (document: HydratedDocument<TaskPersistence>): Task => ({
  id: document._id.toString(),
  title: document.title,
  status: document.status,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export async function listTasks(query: TaskListQuery): Promise<TaskListResult> {
  const { documents, total } = await findTaskDocuments(query);
  const totalPages = Math.ceil(total / query.limit);
  return {
    data: documents.map(toTask),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1 && totalPages > 0,
    },
  };
}

export async function findTaskById(id: string): Promise<Task> {
  const document = await findTaskDocumentById(id);
  if (!document) {
    throw new AppError(`No existe una tarea con el id ${id}.`, 404, 'TASK_NOT_FOUND');
  }
  return toTask(document);
}

export async function createTask(title: string): Promise<Task> {
  return toTask(await createTaskDocument(title));
}

export async function updateTask(id: string, changes: TaskUpdate): Promise<Task> {
  const document = await updateTaskDocument(id, changes);
  if (!document) {
    throw new AppError(`No existe una tarea con el id ${id}.`, 404, 'TASK_NOT_FOUND');
  }
  return toTask(document);
}

export async function completeTask(id: string): Promise<Task> {
  return updateTask(id, { status: 'completed' });
}

export async function deleteTask(id: string): Promise<void> {
  const document = await deleteTaskDocument(id);
  if (!document) {
    throw new AppError(`No existe una tarea con el id ${id}.`, 404, 'TASK_NOT_FOUND');
  }
}
