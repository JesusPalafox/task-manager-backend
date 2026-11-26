import 'dotenv/config';
import type { Server } from 'node:http';
import { app } from './app.js';
import { env, readEnvironment } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let server: Server | undefined;
let shuttingDown = false;

async function start(): Promise<void> {
  const config = readEnvironment();
  await connectDatabase(config);
  server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`API ${env.APP_VERSION} disponible en ${env.PUBLIC_API_URL}`);
    console.log('MongoDB conectado.');
  });
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => (error ? reject(error) : resolve()));
    });
  }
  await disconnectDatabase();
  console.log('Servidor y conexión MongoDB cerrados.');
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    void shutdown().catch(() => {
      console.error('No se pudo completar el cierre ordenado.');
      process.exitCode = 1;
    });
  });
}

void start().catch(() => {
  console.error('No se pudo iniciar la API. Comprueba la configuración de Atlas.');
  process.exitCode = 1;
});
