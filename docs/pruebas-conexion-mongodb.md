# EC2 F1 A5 — pruebas de conexión a MongoDB Atlas

> Plantilla de evidencias. **Pendiente de ejecutar en el equipo del estudiante.**
> No anotar credenciales, URI, contraseñas ni capturas que las incluyan.

| Caso | Método y ruta | Esperado | Obtenido | requestId | Estado |
|---|---|---|---|---|---|
| Salud API | GET /health | 200 | Pendiente | — | Pendiente |
| Salud Atlas | GET /health/database | 200 | Pendiente | — | Pendiente |
| Listar tareas heredadas | GET /api/tasks | 200 | Pendiente | — | Pendiente |
| URI/clave incorrecta (temporal) | Inicio del servidor | No iniciar puerto | Pendiente | — | Pendiente |
| Detener con Ctrl+C | SIGINT | Cierre ordenado | Pendiente | — | Pendiente |

Comprobar en terminal: `pnpm install`, `pnpm check`, `pnpm build` y `pnpm dev`.
Comprobar `git check-ignore .env` y `git ls-files .env` antes de publicar.
