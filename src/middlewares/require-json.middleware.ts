import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function requireJson(req: Request, _res: Response, next: NextFunction): void {
  if (!req.is('application/json')) {
    next(new AppError('Envía Content-Type: application/json.', 415, 'UNSUPPORTED_MEDIA_TYPE'));
    return;
  }
  next();
}
