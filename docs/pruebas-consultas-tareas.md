# EC2 F3 A8 — pruebas de consultas

**Pendiente de verificar en Postman y Atlas.** Registrar resultados reales después de ejecutar la API.

| Caso | URL | Esperado | Observado | Estado |
|---|---|---|---|---|
| Predeterminado | GET /api/tasks | 200, data y meta | — | Pendiente |
| Página 2 | GET /api/tasks?page=2&limit=5 | 200, meta.page 2 | — | Pendiente |
| Pendientes | GET /api/tasks?status=pending | 200 | — | Pendiente |
| Búsqueda | GET /api/tasks?search=api | 200 | — | Pendiente |
| Orden título | GET /api/tasks?sortBy=title&order=asc | 200 | — | Pendiente |
| Combinada | GET /api/tasks?page=1&limit=5&status=pending&search=api&sortBy=title&order=asc | 200 | — | Pendiente |
| Página inválida | GET /api/tasks?page=0 | 422 | — | Pendiente |
| Parámetro desconocido | GET /api/tasks?foo=bar | 422 | — | Pendiente |
| Repetido | GET /api/tasks?status=pending&status=completed | 422 | — | Pendiente |
| Regresión CRUD | POST, GET, PATCH, DELETE | 201, 200, 200, 204 | — | Pendiente |

Incluye requestId y captura sin credenciales ni información personal.
