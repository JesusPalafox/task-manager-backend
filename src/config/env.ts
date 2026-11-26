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
function nonNegativeInt(name: string, fallback: number): number {
  const n = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(n) || n < 0) throw new Error(name + ' debe ser un entero no negativo.');
  return n;
}
function httpUrl(name: string): string {
  const input = required(name).replace(/\/$/, '');
  let url: URL;
  try { url = new URL(input); } catch { throw new Error(name + ' requiere una URL absoluta.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || (name === 'CORS_ORIGIN' && url.pathname !== '/'))
    throw new Error(name + ' requiere un origen http(s) sin credenciales ni parámetros.');
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:')
    throw new Error(name + ' debe usar HTTPS en producción.');
  return input;
}
const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
if (!['development', 'test', 'production'].includes(nodeEnv)) throw new Error('NODE_ENV inválido.');
export const env = Object.freeze({
  NODE_ENV: nodeEnv,
  APP_VERSION: process.env.APP_VERSION?.trim() || '1.0.0',
  PUBLIC_API_URL: httpUrl('PUBLIC_API_URL'),
  TRUST_PROXY_HOPS: nonNegativeInt('TRUST_PROXY_HOPS', 0),
  JWT_SECRET: secret,
  JWT_EXPIRES_IN: expiresIn,
  JWT_ISSUER: process.env.JWT_ISSUER?.trim() || 'task-api-express',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE?.trim() || 'task-api-client',
  CORS_ORIGIN: httpUrl('CORS_ORIGIN'),
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
