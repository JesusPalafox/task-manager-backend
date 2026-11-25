import type { Request, Response } from 'express';
import { registerUser, loginUser, getAuthenticatedUser } from '../services/auth.service.js';
import type { RegisterInput, LoginInput } from '../types/auth.js';
export async function postRegister(_req: Request, res: Response): Promise<void> {
  const result = await registerUser(res.locals.authInput as RegisterInput);
  res.status(201).json({ data: result });
}
export async function postLogin(_req: Request, res: Response): Promise<void> {
  const result = await loginUser(res.locals.authInput as LoginInput);
  res.status(200).json({ data: result });
}

export async function getMe(_req: Request, res: Response): Promise<void> {
  const auth = res.locals.auth;
  const user = await getAuthenticatedUser(auth.userId);
  res.status(200).json({ data: { user } });
}
