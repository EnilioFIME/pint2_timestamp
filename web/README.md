# web — Panel de Administración

## ¿Qué es esto?
Interfaz web para administradores. Permite gestionar cercos geográficos,
sitios y consultar reportes de asistencia. Se comunica con el backend
mediante su API REST.

## Tecnologías
- React — librería para construir las pantallas
- Vite — herramienta que levanta el servidor local y empaqueta el proyecto
- Node.js 20+ — requerido para correr las herramientas anteriores
- npm — gestor de paquetes (no usar yarn ni pnpm)

## Requisitos previos
Instala esto una sola vez en tu computadora:
- [Node.js 20+](https://nodejs.org) — npm viene incluido
- Verifica con: `node -v` y `npm -v`

---

## PASO 0 — Inicializar el proyecto (solo una persona, solo una vez)

> ⚠️ Esto lo hace **una sola persona** del equipo y sube el resultado al repositorio.
> Si ya existe `vite.config.js` en la carpeta `web/`, este paso ya fue hecho — ve directo al Paso 1.

Coordinen en el equipo quién hace esto primero. Una vez hecho, todos los demás siguen desde el Paso 1.

```bash
cd web
npm create vite@latest . -- --template react
```

Vite va a preguntar si quiere sobreescribir archivos — responde **yes**.

Luego sube los archivos generados al repositorio:

```bash
git add .
git commit -m "feat(web): inicializar proyecto React con Vite"
git push
```

---

## PASO 1 — Primera vez usando el proyecto (todos los demás)

> Asegúrate de que el Paso 0 ya fue hecho por alguien antes de continuar.

```bash
cd web
npm install
```

Crea tu archivo de configuración local:
- Crea un archivo llamado `.env` dentro de `web/`
- Agrega esta línea:

```
VITE_BACKEND_BASE_URL=http://localhost:8080
```

Levanta el servidor:

```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`

---

## PASO 2 — Uso diario (una vez que ya tienes todo instalado)

```bash
cd web
npm run dev
```

---

## Estructura del proyecto
- `src/components/` — piezas visuales reutilizables (botones, tablas, etc.)
- `src/pages/`      — pantallas completas (Dashboard, Reportes, Sitios)
- `src/services/`   — funciones que llaman al backend
- `src/hooks/`      — lógica reutilizable de React

---

## Reglas del equipo
- El archivo `.env` **no se sube al repo** (ya está en `.gitignore`)
- La carpeta `node_modules/` **no se sube al repo**
- Usar solo **npm** — no usar yarn ni pnpm