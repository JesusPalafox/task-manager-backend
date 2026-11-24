# EC2 F1 A5 — reflexión de MongoDB

Guía de estudio (completa con tus palabras después de realizar las pruebas):

- **¿Por qué Atlas y no un arreglo?** Atlas permite guardar información que no desaparece al reiniciar el proceso.
- **¿Para qué sirve Mongoose?** Conecta Node/Express a MongoDB y permite construir modelos, consultas y reglas.
- **¿Por qué conectar antes de escuchar?** Así la API no declara estar lista cuando no puede usar su base de datos.
- **¿Por qué ocultar .env?** Contiene credenciales que no deben publicarse.
- **¿Qué es /health/database?** Un diagnóstico que ejecuta un ping a MongoDB, sin exponer secretos.
- **¿Cómo se detiene correctamente?** Se cierra el servidor HTTP y después la conexión Mongoose.

Responde también las preguntas personales incluidas en la guía completa proporcionada por el docente.
