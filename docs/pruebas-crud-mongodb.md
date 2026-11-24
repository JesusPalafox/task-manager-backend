# EC2 F2 A7 — pruebas del CRUD persistente

**Plantilla de evidencias, no resultados ejecutados.** Completar en Postman con MongoDB Atlas conectado.

| Prueba | Solicitud | Esperado | Obtenido | Estado |
|---|---|---|---|---|
| Crear | POST /api/tasks | 201 | — | Pendiente |
| Listar | GET /api/tasks | 200 | — | Pendiente |
| Consultar | GET /api/tasks/:id | 200 | — | Pendiente |
| Editar título | PATCH /api/tasks/:id | 200 | — | Pendiente |
| Editar estado | PATCH /api/tasks/:id | 200 | — | Pendiente |
| Completar | PATCH /api/tasks/:id/complete | 200 | — | Pendiente |
| Eliminar | DELETE /api/tasks/:id | 204 | — | Pendiente |
| Actualización vacía | PATCH {} | 422 | — | Pendiente |
| Estado inválido | PATCH {"status":"archived"} | 422 | — | Pendiente |
| Campo prohibido | PATCH {"createdAt":"..."} | 422 | — | Pendiente |
| Persistencia tras reinicio | GET /api/tasks | 200, datos conservados | — | Pendiente |

Guarda IDs reales de Postman y requestId; no incluyas secretos.
