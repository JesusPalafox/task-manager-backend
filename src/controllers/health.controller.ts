import type { Request, Response } from 'express';
import { checkDatabaseHealth } from '../services/health.service.js';

export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({ status: 'ok' });
}

export async function getDatabaseHealth(
  _req: Request,
  res: Response,
): Promise<void> {
  await checkDatabaseHealth();
  res.status(200).json({ status: 'ok', database: 'connected' });
}
