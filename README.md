# Task Manager Backend — API Express

API para las actividades de **Programación Backend con Frameworks**.
Rama `feature/mongodb-atlas`: preparación EC2 F1 A5.
El CRUD heredado permanece en memoria **solo durante A5**; las siguientes actividades lo migran a Atlas.

## Requisitos

Node.js, PNPM, cuenta MongoDB Atlas y Postman.

## Variables

Copia `.env.example` a `.env` en tu computadora. Define:
- `PORT`: puerto local (3000).
- `MONGODB_URI`: cadena de conexión de Atlas (nunca en GitHub).
- `MONGODB_DB_NAME`: `task_api`.

En Atlas usa un usuario con permisos `readWrite` solo en `task_api`.
En acceso de red permite solo tu IP actual; **no abras el acceso a 0.0.0.0/0**.
Nunca guardes la URI ni una contraseña real en documentación.

## Instalar y verificar

```bash
pnpm install
pnpm check
pnpm build
pnpm dev
```

`pnpm install` también debe actualizar `pnpm-lock.yaml` al incorporar Mongoose.
Guarda ese lockfile actualizado antes de entregar la actividad.

## Salud y rutas

- `GET /health`: disponibilidad HTTP.
- `GET /health/database`: ping real a Atlas; 503 ante indisponibilidad.
- `GET /api/tasks`: listado heredado.
- `GET /api/tasks/:id`: detalle heredado.
- `POST /api/tasks`: crear tarea.
- `PATCH /api/tasks/:id/complete`: completar.
- `DELETE /api/tasks/:id`: eliminar.

Los errores nuevos se envían con `error.code`, `error.message` y `error.requestId`.
Para cerrar, presiona Ctrl+C y verifica que se cierra MongoDB.

## Evidencias

Completa `docs/pruebas-conexion-mongodb.md` con resultados **reales** de Postman.
No está verificado el acceso a tu cluster privado desde GitHub.
