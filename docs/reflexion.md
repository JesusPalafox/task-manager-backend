# Reflexión — EC1 F1 A2

##  Jesus Samuel Palafox Lopez
## 1. Función de Node.js
Node.js es el entorno que permite ejecutar JavaScript (y en este caso TypeScript compilado) fuera del navegador, directamente en la terminal. En este proyecto es lo que le da acceso al programa a cosas que un navegador no ofrece, como `process.env` para leer variables de entorno, o el sistema de módulos para importar y exportar archivos entre `models`, `data`, `services` y `utils`. Sin Node.js, el código de `index.ts` no tendría dónde ejecutarse.
 
## 2. Aportes de TypeScript
TypeScript agrega tipado estático, lo que permite detectar errores antes de ejecutar el programa, no hasta que algo falla en producción. Por ejemplo, la interfaz `Task` obliga a que cada tarea tenga `id`, `title`, `status` y `createdAt`; si en algún lugar del código intentara crear una tarea sin alguno de esos campos, o con un tipo incorrecto (como un `status` que no sea `'pending'` o `'completed'`), TypeScript marcaría el error inmediatamente en el editor. Esto ahorra tiempo de depuración y hace el código más confiable frente a JavaScript, donde ese mismo error solo se notaría hasta ejecutar la aplicación.
 
## 3. ¿Por qué se separaron models, data, services y utils?
Cada carpeta tiene una única responsabilidad, lo que facilita mantener y probar el código:
- `models` define la forma de los datos (la interfaz `Task` y el tipo `TaskStatus`), sin lógica.
- `data` guarda la colección de tareas en memoria, separada de las reglas que la manipulan.
- `services` concentra las reglas de negocio (crear, listar, completar, eliminar una tarea), que es donde vive la lógica real de la aplicación.
- `utils` reúne funciones reutilizables que no dependen del dominio de tareas, como `delay` (una espera asíncrona genérica) o `getAppName` (lectura de configuración).
Si todo estuviera junto en `index.ts`, cualquier cambio en una regla de negocio implicaría tocar el mismo archivo que maneja la entrada/salida del programa, aumentando el riesgo de romper algo.
 
## 4. Diferencia entre una función síncrona y una función async
Una función síncrona se ejecuta línea por línea y bloquea la ejecución hasta terminar; el programa espera a que esa función termine antes de seguir. Una función `async` puede pausar su ejecución en un punto (con `await`) mientras espera el resultado de una operación que toma tiempo —como la función `delay` de este proyecto, que usa `setTimeout` dentro de una `Promise`— sin bloquear el resto del programa. En `main()`, `await delay(300)` pausa esa función específica 300 milisegundos, pero en una aplicación real esto permitiría que otras tareas sigan corriendo mientras se espera, por ejemplo, la respuesta de una base de datos.
 
## 5. ¿Por qué findTaskById devuelve Task | undefined?
Porque buscar una tarea por su `id` no siempre tiene éxito: si el `id` no existe en el arreglo `tasks`, no hay ninguna tarea que devolver. El tipo `Task | undefined` obliga a quien use esta función a considerar ambos casos antes de usar el resultado, en vez de asumir que siempre habrá una tarea válida. Esto es justamente lo que permite que `completeTask` y `deleteTask` lancen un error controlado ("No existe una tarea con el id...") cuando `findTaskById` devuelve `undefined`, en lugar de que el programa falle de forma inesperada al intentar usar una tarea que no existe.
 
## 6. Ventaja de leer APP_NAME desde process.env
Permite cambiar el nombre de la aplicación (o cualquier otro valor de configuración) sin modificar el código fuente ni recompilar el proyecto. Por ejemplo, al correr `$env:APP_NAME="Gestor de tareas UES"; pnpm start`, el programa muestra ese nombre en lugar del valor por defecto `'Task Manager Backend'`, simplemente porque `getAppName()` lee la variable de entorno en tiempo de ejecución. Esta misma idea es la que después se usará para manejar credenciales sensibles (como contraseñas o tokens) sin escribirlas directamente en el código.
 
## 7. Diferencia observada entre pnpm start y pnpm build + pnpm serve
`pnpm start` ejecuta directamente los archivos TypeScript usando `tsx`, que los transforma "al vuelo" en memoria sin generar archivos nuevos — es rápido y cómodo durante el desarrollo. `pnpm build` en cambio usa `tsc` para compilar todo `src/` a JavaScript real dentro de la carpeta `dist/`, y `pnpm serve` ejecuta ese JavaScript ya compilado directamente con `node`, sin depender de TypeScript en ese momento. La salida en consola es la misma en ambos casos, pero `build + serve` es el flujo pensado para producción, donde no se quiere depender de herramientas de desarrollo como `tsx`.
 
## 8. ¿Qué parte de este proyecto podrá reutilizarse cuando se construya la API con Express?
La capa de `services` (`task.service.ts`) es la que más se reutilizará, porque contiene toda la lógica de negocio (crear, listar, completar, eliminar tareas) sin depender de cómo se invoca esa lógica. Cuando se agregue Express, en vez de llamar estas funciones desde `index.ts` en la consola, se llamarán desde controladores de rutas HTTP (por ejemplo, un `POST /tasks` llamaría a `createTask`). De la misma forma, el `models/task.ts` (la interfaz `Task`) y `utils/env.ts` (lectura de configuración) se mantienen prácticamente igual, ya que no están atados a la consola ni a Express.