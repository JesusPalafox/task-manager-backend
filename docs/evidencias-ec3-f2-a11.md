# EC3 F2 A11 — Calidad, OpenAPI y React

Estado: implementación preparada; pruebas locales aún no verificadas.

## Comprobación
- Instalar desde raíz con `pnpm install`.
- Ejecutar `pnpm verify` (check, seis casos Vitest, build Backend y build cliente).
- Iniciar API con `pnpm dev`.
- Iniciar React con `pnpm client:dev`.
- Abrir http://localhost:3000/api-docs/ y /api-docs.json.
- Validar /api/auth/me y /api/tasks con JWT de una cuenta real.
- Abrir http://localhost:5173 e iniciar sesión.
- Confirmar cierre local, manejo de 401, CORS y ausencia de contraseñas/tokens en evidencias.
