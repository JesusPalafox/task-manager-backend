import { AppError } from '../errors/app-error.js';
import { pingDatabase } from '../config/database.js';

export async function checkDatabaseHealth(): Promise<void> {
  try {
    await pingDatabase();
  } catch {
    throw new AppError(
      'La base de datos no está disponible.',
      503,
      'DATABASE_UNAVAILABLE',
    );
  }
}
