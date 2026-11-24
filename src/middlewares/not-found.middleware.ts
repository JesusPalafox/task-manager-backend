import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function notFound(
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new AppError('La ruta solicitada no existe.', 404, 'ROUTE_NOT_FOUND'));
}
