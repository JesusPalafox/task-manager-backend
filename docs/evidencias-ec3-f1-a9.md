# EC3 F1 A9 — Evidencias

Estado: código propuesto en la rama ec3-a9-auth; **pendiente de pruebas en el entorno local**.

1. Instalar dependencias y actualizar pnpm-lock.yaml con `pnpm install`.
2. Configurar JWT_SECRET de al menos 32 bytes en `.env` privado.
3. Ejecutar `pnpm check` y `pnpm build`.
4. Probar POST /api/auth/register: 201, rol user, sin passwordHash.
5. Probar POST /api/auth/login: 200, accessToken y Bearer.
6. Probar contraseñas incorrectas, correo duplicado, campos adicionales y Content-Type incorrecto.
7. Comprobar que las rutas de tareas continúan públicas en A9.
8. Registrar capturas sin contraseñas ni tokens.
