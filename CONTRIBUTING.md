\# 🚀 Guía de Colaboración y Workflow - Proyecto Escolar



¡Bienvenidos al equipo! Para que el desarrollo sea fluido y no perdamos código en el camino, utilizaremos un flujo de trabajo basado en \*\*Feature Branches\*\* (Ramas por Funcionalidad) y \*\*Pull Requests\*\*.



\---



\## 📌 1. Reglas de Oro



\* ❌ \*\*Prohibido\*\*: Nadie hace `push` directo a `main` ni a `develop`.

\* 🌱 \*\*Ramas\*\*: Toda mejora o cambio se trabaja en una rama independiente.

\* 🔄 \*\*Pull antes de Work\*\*: Antes de empezar a programar, siempre descarga lo más nuevo de `develop`.

\* 📁 \*\*Respeto a las carpetas\*\*:

&#x20;   \* Si trabajas en Web, mantente dentro de `/web`.

&#x20;   \* Si trabajas en Backend, mantente dentro de `/backend`.

&#x20;   \* No toques archivos de otras áreas sin avisar al encargado.



\---



\## 🔄 2. El Flujo de Trabajo (Paso a Paso)



Cuando te toque realizar una tarea (ej. \*"Crear el login de la web"\*), sigue estos pasos:



\### Paso A: Sincroniza tu máquina

Asegúrate de tener lo último que tus compañeros han subido a la base del proyecto:



```bash

git checkout develop

git pull origin develop



\### Paso B: Crea tu rama de tarea

Usa un nombre descriptivo para tu rama. No uses solo tu nombre, usa el nombre de la función que vas a programar:



```bash
# Formato: feature/nombre-de-la-tarea

git checkout -b feature/login-web




