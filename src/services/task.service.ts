import mongoose, { type HydratedDocument } from 'mongoose';
import { AppError } from '../errors/app-error.js';
import {
  TaskModel,
  type Task,
  type TaskPersistence,
  type TaskUpdate,
} from '../models/task.js';

const toTask = (document: HydratedDocument<TaskPersistence>): Task => ({
  id: document._id.toString(),
  title: document.title,
  status: document.status,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

const mapPersistenceError = (error: unknown): AppError => {
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
};

export async function listTasks(): Promise<Task[]> {
  try {
    return (await TaskModel.find().sort({ createdAt: 1 })).map(toTask);
  } catch (error: unknown) {
    throw mapPersistenceError(error);
  }
}

export async function findTaskById(id: string): Promise<Task> {
  try {
    const document = await TaskModel.findById(id);
    if (!document) {
      throw new AppError(`No existe una tarea con el id ${id}.`, 404, 'TASK_NOT_FOUND');
    }
    return toTask(document);
  } catch (error: unknown) {
    throw mapPersistenceError(error);
  }
}

export async function createTask(title: string): Promise<Task> {
  try {
    return toTask(await TaskModel.create({ title, status: 'pending' }));
  } catch (error: unknown) {
    throw mapPersistenceError(error);
  }
}

export async function updateTask(id: string, changes: TaskUpdate): Promise<Task> {
  try {
    const document = await TaskModel.findByIdAndUpdate(
      id,
      { $set: changes },
      { new: true, runValidators: true },
    );
    if (!document) {
      throw new AppError(`No existe una tarea con el id ${id}.`, 404, 'TASK_NOT_FOUND');
    }
    return toTask(document);
  } catch (error: unknown) {
    throw mapPersistenceError(error);
  }
}

export async function completeTask(id: string): Promise<Task> {
  return updateTask(id, { status: 'completed' });
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const document = await TaskModel.findByIdAndDelete(id);
    if (!document) {
      throw new AppError(`No existe una tarea con el id ${id}.`, 404, 'TASK_NOT_FOUND');
    }
  } catch (error: unknown) {
    throw mapPersistenceError(error);
  }
}
