import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import { env } from '../config/env.js';

export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({
    data: { status: 'up', version: env.APP_VERSION, environment: env.NODE_ENV },
  });
}
export async function getDatabaseHealth(_req: Request, res: Response): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db)
      throw new Error('Sin conexión a MongoDB');
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ data: { status: 'up' } });
  } catch {
    res.status(503).json({ data: { status: 'down' } });
  }
}
