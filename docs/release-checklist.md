# Backend EC3 F3 A12 — Checklist de liberación

Marcar solo después de comprobar resultados reales.

- [ ] pnpm install --frozen-lockfile termina correctamente
- [ ] pnpm verify: 6 pruebas backend y 3 pruebas cliente + builds
- [ ] Registro, login, /me y CRUD completo funcionan desde el navegador
- [ ] Un user no puede borrar (403) y admin sí (204)
- [ ] Render publica el backend con /health/database 200
- [ ] Swagger usa la URL pública de producción
- [ ] La SPA usa HTTPS y CORS_ORIGIN exacto
- [ ] pnpm smoke:release aprobado
- [ ] No se publicaron secretos ni tokens en Git/evidencias
- [ ] La etiqueta v1.0.0 apunta al commit realmente desplegado
