import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';
import { isUserRole, type User } from '../models/user.js';
import type { AccessTokenSubject } from '../types/auth.js';

const key = new TextEncoder().encode(env.JWT_SECRET);
export async function createAccessToken(user: User): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(user.id)
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(key);
}
export async function verifyAccessToken(token: string): Promise<AccessTokenSubject> {
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithms: ['HS256'],
    });
    if (typeof payload.sub !== 'string' || !isUserRole(payload.role))
      throw new Error('Claims incorrectos');
    return { userId: payload.sub, role: payload.role };
  } catch {
    throw new AppError('El token no es válido o expiró.', 401, 'INVALID_TOKEN');
  }
}
