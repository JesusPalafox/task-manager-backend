import 'dotenv/config';

export interface AppConfig {
  port: number;
  mongoUri: string;
  mongoDbName: string;
}
const required = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
};
const secret = required('JWT_SECRET');
if (Buffer.byteLength(secret, 'utf8') < 32) {
  throw new Error('JWT_SECRET debe contener al menos 32 bytes.');
}
const expiresIn = process.env.JWT_EXPIRES_IN?.trim() || '1h';
if (!/^\d+[smhd]$/.test(expiresIn)) {
  throw new Error('JWT_EXPIRES_IN debe usar un formato como 15m, 1h o 7d.');
}
function positiveInt(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1) throw new Error(name + ' debe ser entero positivo.');
  return value;
}
export const env = Object.freeze({
  JWT_SECRET: secret,
  JWT_EXPIRES_IN: expiresIn,
  JWT_ISSUER: process.env.JWT_ISSUER?.trim() || 'task-api-express',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE?.trim() || 'task-api-client',
  CORS_ORIGIN: required('CORS_ORIGIN'),
  AUTH_RATE_LIMIT_WINDOW_MS: positiveInt('AUTH_RATE_LIMIT_WINDOW_MS', 900000),
  AUTH_RATE_LIMIT_MAX: positiveInt('AUTH_RATE_LIMIT_MAX', 10),
});
export function readEnvironment(): AppConfig {
  const port = Number(process.env.PORT ?? 3000);
  const mongoUri = required('MONGODB_URI');
  const mongoDbName = required('MONGODB_DB_NAME');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT inválido.');
  if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) throw new Error('MONGODB_URI inválida.');
  if (!/^[a-zA-Z0-9_-]+$/.test(mongoDbName)) throw new Error('MONGODB_DB_NAME inválido.');
  return { port, mongoUri, mongoDbName };
}
