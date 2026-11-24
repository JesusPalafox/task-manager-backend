# EC2 F3 A8 — explicación para la revisión presencial

**Ruta → middleware → controlador → servicio → repositorio → modelo.**

- **Ruta**: relaciona la URL con los manejadores.
- **Middleware**: valida los parámetros externos y deja un objeto TaskListQuery seguro.
- **Controlador**: elige la forma y estado de la respuesta HTTP.
- **Servicio**: aplica reglas, convierte documentos y calcula metadatos.
- **Repositorio**: consulta MongoDB mediante Mongoose.
- **Modelo**: define el esquema y las restricciones de los documentos.
- **skip**: cantidad de tareas que se omiten para una página.
- **limit**: máximo de resultados a mostrar.
- **countDocuments**: total de documentos que cumplen el mismo filtro.
- **escapeRegex**: trata caracteres especiales como texto literal.
- **Segundo orden por _id**: estabiliza el orden si dos tareas comparten fecha o título.

Completa las reflexiones personales y resultados tras ejecutar Postman.
