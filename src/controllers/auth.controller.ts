import type { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service.js';
import type { RegisterInput, LoginInput } from '../types/auth.js';
export async function postRegister(_req: Request, res: Response): Promise<void> {
  const result = await registerUser(res.locals.authInput as RegisterInput);
  res.status(201).json({ data: result });
}
export async function postLogin(_req: Request, res: Response): Promise<void> {
  const result = await loginUser(res.locals.authInput as LoginInput);
  res.status(200).json({ data: result });
}
