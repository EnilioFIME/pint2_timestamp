# web — App Web (Administración)

## Propósito
Interfaz web para administradores: gestión de **cercos geográficos**, alta/baja de sitios, y consulta de **reportes de asistencia**.

## Tecnologías
- React
- Node.js (npm/pnpm/yarn)
- Consumo de API REST del backend

## Estructura relevante
- `src/components`: componentes UI
- `src/pages`: pantallas
- `src/services`: clientes HTTP / API
- `src/hooks`: hooks reutilizables

## Cómo ejecutarlo localmente
Este módulo es un **esqueleto** de estructura. Para bootstrap rápido con Vite:

1. Desde la raíz del repo:
   - `cd web`
2. Inicializa proyecto (elige una opción):
   - Vite (recomendado): `npm create vite@latest . -- --template react`
   - CRA (alternativa): `npx create-react-app .`
3. Configura endpoint del backend (ejemplo):
   - crea `.env` con `VITE_BACKEND_BASE_URL=http://localhost:8080`
4. Ejecuta:
   - `npm install`
   - `npm run dev` (Vite) o `npm start` (CRA)

> Nota: el `package.json` actual solo existe como placeholder; tras bootstrap se reemplazará por el generado por la herramienta elegida.
