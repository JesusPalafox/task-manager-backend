# EC2 F2 A6 — pruebas de persistencia

**Evidencias pendientes de ejecutar con MongoDB Atlas y Postman.**

| Caso | Método | Esperado | Resultado observado | Estado |
|---|---|---|---|---|
| Crear tarea | POST /api/tasks | 201, ObjectId | — | Pendiente |
| Consultar lista | GET /api/tasks | 200, data[] | — | Pendiente |
| Consultar detalle | GET /api/tasks/:id | 200, id texto | — | Pendiente |
| Completar tarea | PATCH /api/tasks/:id/complete | 200, status completed | — | Pendiente |
| Eliminar tarea | DELETE /api/tasks/:id | 204 | — | Pendiente |
| Reiniciar API y consultar | GET /api/tasks | Los datos permanecen | — | Pendiente |
| ID inválido | GET /api/tasks/1 | 400 INVALID_ID | — | Pendiente |
| ID válido inexistente | GET /api/tasks/:id | 404 TASK_NOT_FOUND | — | Pendiente |

Anota el requestId devuelto y agrega capturas sin datos sensibles después de cada prueba.
