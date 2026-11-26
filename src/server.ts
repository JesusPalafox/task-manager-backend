import 'dotenv/config';
import type { Server } from 'node:http';
import { app } from './app.js';
import { env, readEnvironment } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

let server: Server | undefined;
let shuttingDown = false;

let startupPhase = 'leer la configuración';

async function start(): Promise<void> {
  const config = readEnvironment();
  startupPhase = 'conectar MongoDB Atlas';
  await connectDatabase(config);
  startupPhase = 'abrir el puerto HTTP';
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

void start().catch((error: unknown) => {
  // No imprimir mensajes ni objetos de error: podrían contener la URI o secretos.
  const diagnostic = error !== null && typeof error === 'object'
    ? error as { name?: unknown; code?: unknown; cause?: { code?: unknown } }
    : {};
  const safeCode = diagnostic.code ?? diagnostic.cause?.code;
  console.error('Fallo al iniciar:', startupPhase);
  console.error('Tipo:', typeof diagnostic.name === 'string' ? diagnostic.name : 'Desconocido');
  if (typeof safeCode === 'string' || typeof safeCode === 'number') {
    console.error('Código:', safeCode);
  }
  if (startupPhase === 'leer la configuración' && error instanceof Error) {
    // La lista permitida contiene solo nombres de variables y descripciones,
    // nunca sus valores ni la cadena privada de MongoDB.
    const allowed = [
      'Falta la variable de entorno ',
      'PORT inválido.',
      'MONGODB_URI inválida.',
      'MONGODB_DB_NAME inválido.',
    ];
    const safe = allowed.some(prefix => error.message.startsWith(prefix))
      && !/[\r\n]/.test(error.message);
    console.error('Validación:', safe ? error.message : 'Valor de configuración inválido.');
  }
  process.exitCode = 1;
});
