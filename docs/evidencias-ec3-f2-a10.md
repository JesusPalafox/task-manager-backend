# EC3 F2 A10 — Evidencias
Código propuesto en la rama `ec3-a10-proteccion`. Pendiente de comprobar en VS Code y Postman.

## Lista de pruebas
- Instalar dependencias y generar lockfile actualizado.
- `pnpm check` y `pnpm build`.
- GET /health público.
- GET /api/tasks sin token: 401.
- GET /api/tasks con Bearer válido: 200.
- DELETE /api/tasks/:id con user: 403.
- DELETE /api/tasks/:id con admin: 204 (tarea existente).
- Login incorrecto: 401. Muchos intentos de login: 429.
- Verificar encabezados Helmet y CORS desde origen permitido.
- Comprobar que no se registraron secretos ni tokens.
