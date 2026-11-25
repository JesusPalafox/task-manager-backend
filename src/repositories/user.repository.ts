import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import { AppError } from '../errors/app-error.js';
import { UserModel, type UserPersistence, type UserRole } from '../models/user.js';
export type UserDocument = HydratedDocument<UserPersistence>;
export interface CreateUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}
function mapError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000)
    return new AppError('Ya existe una cuenta con ese correo electrónico.', 409, 'USER_EMAIL_EXISTS');
  if (error instanceof mongoose.Error.ValidationError)
    return new AppError('El usuario no cumple las reglas del modelo.', 422, 'PERSISTENCE_VALIDATION_ERROR');
  return new AppError('No fue posible acceder al almacenamiento de usuarios.', 503, 'DATABASE_UNAVAILABLE');
}
async function execute<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation(); } catch (error) { throw mapError(error); }
}
export function findUserDocumentByEmail(email: string, includePasswordHash = false):
  Promise<UserDocument | null> {
  return execute(async () => {
    const query = UserModel.findOne({ email });
    if (includePasswordHash) query.select('+passwordHash');
    return query.exec();
  });
}
export function findUserDocumentById(id: string): Promise<UserDocument | null> {
  return execute(() => UserModel.findById(id).exec());
}
export function createUserDocument(data: CreateUserRecord): Promise<UserDocument> {
  return execute(() => UserModel.create(data));
}
export function setUserRoleByEmail(email: string, role: UserRole): Promise<UserDocument | null> {
  return execute(() => UserModel.findOneAndUpdate({ email }, { $set: { role } }, {
    new: true, runValidators: true,
  }).exec());
}
