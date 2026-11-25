import type { User, UserRole } from '../models/user.js';
export interface RegisterInput { name: string; email: string; password: string }
export interface LoginInput { email: string; password: string }
export interface RegisterResult { user: User }
export interface LoginResult {
  user: User;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}
export interface AccessTokenSubject { userId: string; role: UserRole }
