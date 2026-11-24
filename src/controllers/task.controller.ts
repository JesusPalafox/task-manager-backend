import type { Request, Response } from 'express';
import {
  completeTask,
  createTask,
  deleteTask,
  findTaskById,
  listTasks,
  updateTask,
} from '../services/task.service.js';

export async function getTasks(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await listTasks(res.locals.taskQuery));
}

export async function getTask(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await findTaskById(res.locals.taskId as string) });
}

export async function postTask(_req: Request, res: Response): Promise<void> {
  res.status(201).json({ data: await createTask(res.locals.taskTitle as string) });
}

export async function patchTaskComplete(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await completeTask(res.locals.taskId as string) });
}

export async function patchTask(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    data: await updateTask(res.locals.taskId as string, res.locals.taskUpdate),
  });
}

export async function removeTask(_req: Request, res: Response): Promise<void> {
  await deleteTask(res.locals.taskId as string);
  res.status(204).send();
}
