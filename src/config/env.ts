export interface AppConfig {
  port: number;
  mongoUri: string;
  mongoDbName: string;
}

export function readEnvironment(): AppConfig {
  const port = Number(process.env.PORT ?? 3000);
  const mongoUri = process.env.MONGODB_URI?.trim();
  const mongoDbName = process.env.MONGODB_DB_NAME?.trim();

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un puerto válido.');
  }
  if (!mongoUri || !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
    throw new Error('Configura MONGODB_URI en el archivo .env.');
  }
  if (!mongoDbName || !/^[a-zA-Z0-9_-]+$/.test(mongoDbName)) {
    throw new Error('Configura MONGODB_DB_NAME correctamente.');
  }
  return { port, mongoUri, mongoDbName };
}
