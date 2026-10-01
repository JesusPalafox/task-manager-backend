# Task Manager Backend

Aplicación de consola modular para gestionar tareas, construida con **Node.js** y **TypeScript**, sin interfaz gráfica ni framework web. Sirve como base conceptual para una futura API REST con Express.

## Descripción

El programa mantiene una colección de tareas en memoria (se reinicia en cada ejecución) y permite:

- Listar todas las tareas registradas.
- Crear una nueva tarea (validando que el título no esté vacío).
- Completar una tarea existente por su `id`.
- Eliminar una tarea existente por su `id` (desafío individual).
- Listar únicamente las tareas pendientes (desafío individual).
- Mostrar mensajes de error claros ante operaciones inválidas.

## Requisitos

- Node.js (versión LTS)
- PNPM
- Git

## Instalación

```bash
pnpm install
```

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Ejecuta la app y la reinicia automáticamente al detectar cambios. |
| `pnpm start` | Ejecuta la app una sola vez directamente desde TypeScript. |
| `pnpm check` | Revisa los tipos de TypeScript sin generar archivos. |
| `pnpm build` | Compila `src/` hacia `dist/`. |
| `pnpm serve` | Ejecuta con Node.js el JavaScript ya compilado en `dist/`. |

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores si lo deseas:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `APP_NAME` | Nombre mostrado al iniciar la aplicación | `Task Manager Backend` |
| `NODE_ENV` | Entorno de ejecución | `development` |

> El archivo `.env` nunca debe subirse al repositorio (ya está excluido en `.gitignore`).

## Estructura del proyecto

```
task-manager-backend/
├── src/
│   ├── data/
│   │   └── tasks.ts          # Colección de tareas en memoria
│   ├── models/
│   │   └── task.ts           # Tipos e interfaz de una tarea
│   ├── services/
│   │   └── task.service.ts   # Reglas de negocio: crear, listar, completar, eliminar
│   ├── utils/
│   │   ├── delay.ts          # Utilidad de espera asíncrona
│   │   └── env.ts            # Lectura de variables de entorno
│   └── index.ts              # Punto de entrada de la aplicación
├── docs/
│   └── reflexion.md
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── preguntas-cierre.md
├── README.md
└── tsconfig.json
```

## Funcionalidades y manejo de errores

La aplicación controla explícitamente:

- Título vacío al crear una tarea.
- Búsqueda o eliminación de una tarea con un `id` inexistente.
- Intento de completar una tarea inexistente.
- Errores no controlados durante la ejecución asíncrona (capturados en el `catch` final de `main`).
