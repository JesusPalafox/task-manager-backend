import { Schema, model } from 'mongoose';
export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const isUserRole = (value: unknown): value is UserRole =>
  value === 'user' || value === 'admin';

export interface UserPersistence {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
export type User = Omit<UserPersistence, 'passwordHash'> & { id: string };
const userSchema = new Schema<UserPersistence>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: USER_ROLES, default: 'user' },
}, { timestamps: true, versionKey: false });
export const UserModel = model<UserPersistence>('User', userSchema);
