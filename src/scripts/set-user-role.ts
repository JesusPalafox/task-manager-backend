import 'dotenv/config';
import { readEnvironment } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { isUserRole } from '../models/user.js';
import { setUserRoleByEmail } from '../repositories/user.repository.js';

const [emailArgument, roleArgument] = process.argv.slice(2);
if (!emailArgument || !isUserRole(roleArgument) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailArgument)) {
  console.error('Uso: pnpm role:set correo@ejemplo.com user|admin');
  process.exitCode = 1;
} else {
  try {
    await connectDatabase(readEnvironment());
    const user = await setUserRoleByEmail(emailArgument.toLowerCase(), roleArgument);
    if (!user) {
      console.error('Usuario no encontrado.');
      process.exitCode = 1;
    } else {
      console.log('Rol actualizado correctamente.');
    }
  } catch {
    console.error('No fue posible actualizar el rol.');
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}
