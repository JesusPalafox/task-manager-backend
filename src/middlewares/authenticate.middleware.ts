import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { verifyAccessToken } from '../services/token.service.js';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authorization = req.header('authorization');
  if (!authorization) throw new AppError('Debes enviar un token de acceso.', 401, 'AUTHENTICATION_REQUIRED');
  const parts = authorization.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer' || !parts[1])
    throw new AppError('El encabezado Authorization debe usar Bearer <token>.', 401, 'INVALID_AUTHORIZATION_HEADER');
  res.locals.auth = await verifyAccessToken(parts[1]);
  next();
}
