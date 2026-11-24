import mongoose, {
  type FilterQuery,
  type HydratedDocument,
  type SortOrder,
} from 'mongoose';
import { AppError } from '../errors/app-error.js';
import {
  TaskModel,
  type TaskPersistence,
  type TaskUpdate,
} from '../models/task.js';
import type { TaskListQuery } from '../types/task-query.js';

type TaskDocument = HydratedDocument<TaskPersistence>;

export interface TaskPageDocuments {
  documents: TaskDocument[];
  total: number;
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function buildFilter(query: TaskListQuery): FilterQuery<TaskPersistence> {
  const filter: FilterQuery<TaskPersistence> = {};
  if (query.status !== undefined) filter.status = query.status;
  if (query.search !== undefined) {
    filter.title = { $regex: new RegExp(escapeRegex(query.search), 'i') };
  }
  return filter;
}

function buildSort(query: TaskListQuery): Record<string, SortOrder> {
  const direction: SortOrder = query.order === 'asc' ? 1 : -1;
  return { [query.sortBy]: direction, _id: direction };
}

function mapPersistenceError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError(
      'La tarea no cumple las reglas del modelo.',
      422,
      'PERSISTENCE_VALIDATION_ERROR',
      Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    );
  }
  return new AppError(
    'No fue posible acceder al almacenamiento de tareas.',
    503,
    'DATABASE_UNAVAILABLE',
  );
}

async function execute<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    throw mapPersistenceError(error);
  }
}

export async function findTaskDocuments(query: TaskListQuery): Promise<TaskPageDocuments> {
  return execute(async () => {
    const filter = buildFilter(query);
    const skip = (query.page - 1) * query.limit;
    const [documents, total] = await Promise.all([
      TaskModel.find(filter).sort(buildSort(query)).skip(skip).limit(query.limit),
      TaskModel.countDocuments(filter),
    ]);
    return { documents, total };
  });
}

export async function findTaskDocumentById(id: string): Promise<TaskDocument | null> {
  return execute(async () => TaskModel.findById(id));
}

export async function createTaskDocument(title: string): Promise<TaskDocument> {
  return execute(async () => TaskModel.create({ title, status: 'pending' }));
}

export async function updateTaskDocument(
  id: string,
  changes: TaskUpdate,
): Promise<TaskDocument | null> {
  return execute(async () => TaskModel.findByIdAndUpdate(
    id,
    { $set: changes },
    { new: true, runValidators: true },
  ));
}

export async function deleteTaskDocument(id: string): Promise<TaskDocument | null> {
  return execute(async () => TaskModel.findByIdAndDelete(id));
}
