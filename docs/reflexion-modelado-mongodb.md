# EC2 F2 A6 — guía para la explicación al profesor

- **Documento**: registro BSON almacenado en la colección.
- **Esquema**: reglas y tipos que deben cumplir los datos.
- **Modelo**: TaskModel permite consultar, crear y modificar documentos usando Mongoose.
- **ObjectId**: identificador de MongoDB; se transforma a `id` de tipo string en la respuesta.
- **timestamps**: Mongoose gestiona automáticamente createdAt y updatedAt.
- **¿Por qué async/await?** Porque las consultas MongoDB son asíncronas y deben completarse antes de responder.
- **¿Por qué retirar tasks.ts?** Para no tener dos fuentes distintas de verdad.

Redacta tus respuestas personales cuando realices las pruebas; esta hoja es material de estudio.
