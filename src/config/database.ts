import mongoose from 'mongoose';
import type { AppConfig } from './env.js';

export async function connectDatabase(config: AppConfig): Promise<void> {
  await mongoose.connect(config.mongoUri, {
    dbName: config.mongoDbName,
    serverSelectionTimeoutMS: 5000,
  });
}

export async function pingDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    throw new Error('No hay conexión con MongoDB.');
  }
  await mongoose.connection.db.admin().ping();
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
