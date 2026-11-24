import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function validateTaskTitle(req: Request, res: Response, next: NextFunction): void {
  const body: unknown = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    next(new AppError('La solicitud contiene datos inválidos.', 422, 'VALIDATION_ERROR',
      [{ field: 'body', message: 'Debe ser un objeto JSON.' }]));
    return;
  }
  const fields = Object.keys(body);
  if (fields.some((field) => field !== 'title')) {
    next(new AppError('La solicitud contiene datos inválidos.', 422, 'VALIDATION_ERROR',
      [{ field: 'body', message: 'Solo se permite title.' }]));
    return;
  }
  const title = (body as Record<string, unknown>).title;
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) {
    next(new AppError('La solicitud contiene datos inválidos.', 422, 'VALIDATION_ERROR',
      [{ field: 'title', message: 'Es obligatorio un título de 1 a 120 caracteres.' }]));
    return;
  }
  res.locals.taskTitle = title.trim();
  next();
}
