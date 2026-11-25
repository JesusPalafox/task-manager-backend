import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import type { User } from '../models/user.js';
import {
  createUserDocument, findUserDocumentByEmail, findUserDocumentById, type UserDocument,
} from '../repositories/user.repository.js';
import type { LoginInput, LoginResult, RegisterInput, RegisterResult } from '../types/auth.js';
import { hashPassword, verifyPassword } from './password.service.js';
import { createAccessToken } from './token.service.js';
const DUMMY_HASH = '$2b$12$ryC/a3t1mI7fqF6j4w3Z.OpHQerUsIQUPQYXvd4WSgCRuikv6IF82';
export const toPublicUser = (document: UserDocument): User => ({
  id: document._id.toString(),
  name: document.name,
  email: document.email,
  role: document.role,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});
export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserDocumentByEmail(email);
  if (existing) throw new AppError('Ya existe una cuenta con ese correo electrónico.', 409, 'USER_EMAIL_EXISTS');
  const document = await createUserDocument({
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: 'user',
  });
  return { user: toPublicUser(document) };
}
export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const document = await findUserDocumentByEmail(input.email.trim().toLowerCase(), true);
  const valid = await verifyPassword(input.password, document?.passwordHash ?? DUMMY_HASH);
  if (!document || !valid)
    throw new AppError('El correo o la contraseña son incorrectos.', 401, 'INVALID_CREDENTIALS');
  const user = toPublicUser(document);
  return { user, accessToken: await createAccessToken(user), tokenType: 'Bearer',
    expiresIn: env.JWT_EXPIRES_IN };
}

export async function getAuthenticatedUser(userId: string): Promise<User> {
  const document = await findUserDocumentById(userId);
  if (!document) throw new AppError(
    'La cuenta asociada al token ya no está disponible.', 401, 'AUTHENTICATED_USER_NOT_FOUND',
  );
  return toPublicUser(document);
}
