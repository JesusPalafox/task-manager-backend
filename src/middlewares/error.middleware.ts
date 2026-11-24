import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (res.headersSent) {
    return;
  }
  const requestId = String(res.locals.requestId ?? '');
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
        requestId,
      },
    });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'El JSON enviado no es válido.', requestId },
    });
    return;
  }
  console.error('Error no controlado en una solicitud:', requestId);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor.',
      requestId,
    },
  });
}
