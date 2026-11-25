import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import type { RegisterInput, LoginInput } from '../types/auth.js';
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function checkKeys(input: Record<string, unknown>, keys: string[]): void {
  if (Object.keys(input).some((key) => !keys.includes(key))) {
    throw new AppError('El cuerpo contiene campos no permitidos.', 422, 'AUTH_VALIDATION_ERROR');
  }
}
function emailValue(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
function passwordValue(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 8
    && Buffer.byteLength(value, 'utf8') <= 72;
}
export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  try {
    const body: unknown = req.body;
    if (!record(body)) throw new AppError('Cuerpo inválido.', 422, 'AUTH_VALIDATION_ERROR');
    checkKeys(body, ['name', 'email', 'password']);
    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80
        || !emailValue(body.email) || !passwordValue(body.password))
      throw new AppError('Nombre, correo o contraseña inválidos.', 422, 'AUTH_VALIDATION_ERROR');
    const input: RegisterInput = { name: body.name.trim(), email: body.email.trim(), password: body.password };
    res.locals.authInput = input;
    next();
  } catch (error) { next(error); }
}
export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  try {
    const body: unknown = req.body;
    if (!record(body)) throw new AppError('Cuerpo inválido.', 422, 'AUTH_VALIDATION_ERROR');
    checkKeys(body, ['email', 'password']);
    if (!emailValue(body.email) || typeof body.password !== 'string' || body.password.length === 0)
      throw new AppError('Credenciales inválidas.', 422, 'AUTH_VALIDATION_ERROR');
    const input: LoginInput = { email: body.email.trim(), password: body.password };
    res.locals.authInput = input;
    next();
  } catch (error) { next(error); }
}
