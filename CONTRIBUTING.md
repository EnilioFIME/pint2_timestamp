# Guía de Colaboración y Workflow - PINT2 WorkStamp

Para que el desarrollo sea fluido y no perdamos código en el camino, utilizaremos un flujo de trabajo basado en **Feature Branches** (Ramas por Funcionalidad) y **Pull Requests**.

## 1. Reglas de Oro

* ❌ **Prohibido**: Nadie hace `push` directo a `main` ni a `develop`.
* 🌱 **Ramas**: Toda mejora o cambio se trabaja en una rama independiente.
* 🔄 **Pull antes de Work**: Antes de empezar a programar, siempre descarga lo más nuevo de `develop`.
* 📁 **Respeto a las carpetas**:
    * Si trabajas en Web, mantente dentro de `/web`.
    * Si trabajas en Backend, mantente dentro de `/backend`.
    * No toques archivos de otras áreas sin avisar al encargado.


## 2. El Flujo de Trabajo (Paso a Paso)

Cuando te toque realizar una tarea (ej. *"Crear el login de la web"*), sigue estos pasos:

### Paso A: Sincroniza tu máquina
Asegúrate de tener lo último que tus compañeros han subido a la base del proyecto:

```bash
git checkout develop
git pull origin develop
```

### Paso B: Crea tu rama de tarea
Usa un nombre descriptivo para tu rama. No uses solo tu nombre, usa el nombre de la función que vas a programar:

```bash
# Formato: feature/nombre-de-la-tarea
git checkout -b feature/login-web
```

### Paso C: Trabaja y haz Commits
Mientras programas, guarda tus avances con mensajes claros:

```bash
git add .
git commit -m "feat: agrega formulario de login y validaciones"
```
### Paso D: Sube tu código y abre un Pull Request (PR)
Cuando termines la tarea, sube tu rama a GitHub:
```bash
git push origin feature/login-web
```
* Ve a GitHub y verás un botón verde: "Compare & pull request".

* Asegúrate de que la base sea develop.

* Etiqueta a un compañero como Reviewer para que revise tu código.

## 3. Revisiones y Merges

Para que el código de alguien pase a `develop`, otra persona debe revisarlo:

* 🔍 Revisión: Entra al PR y revisa la pestaña Files changed
* ✅ Aprobación: Clic en Review changes → Approve
* 🔀 Merge: Una vez aprobado, el autor puede hacer Merge pull request

## 4. Estructura del Proyecto

Estamos trabajando en un **Monorepo**. Asegúrate de ubicar tus archivos correctamente:

* 📂 `backend/`: API, base de datos y lógica de servidor.

* 📂 `web/`: Todo lo relacionado con la interfaz de navegador.

* 📂 `mobile/`: Aplicación móvil (Kotlin/Android).

* 📂 `docs/`: Documentación del proyecto, diagramas y entregables.

* 📂 `infra/`: Configuraciones de servidor o scripts de despliegue.

## 5. Glosario

* `main`: Versión estable del proyecto, esto es lo que vamos a entregar
* `develop`: Borrador, aquí vamos a ir juntando todo lo que se vaya terminando
* `feature/`: Ramas temporales para trabajar tareas específicas
* **Conflictos**: Avisen en el grupo de cualquier conflicto que no puedan resolver con ChatGPT, lo resolvemos juntos
