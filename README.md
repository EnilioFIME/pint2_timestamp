# FieldCheck — Monorepo (Control de Asistencia)

Sistema de control de asistencia para empleados de campo en una empresa constructora. El objetivo es registrar **clock-in/clock-out** desde obra vía **NFC**, detectar intentos de fraude con un **motor de heurísticas**, y cuando aplique, reforzar la validación con **biometría facial** (Azure Face API). La administración (cercos geográficos, catálogos y reportes) vive en una app web.

## Módulos
- `mobile/`: App Android para checadores (NFC + biometría bajo sospecha)
- `web/`: App web de administración (React)
- `backend/`: API REST (Spring Boot) + heurísticas + orquestación Azure + persistencia en Azure SQL
- `shared/`: DTOs y documentación compartida
- `infra/`: Infraestructura como código (Azure Bicep) y scripts SQL
- `docs/`: Documentación de arquitectura y decisiones

## Tecnologías
- Android: Java/Kotlin, NFC, cámara
- Web: React, Node.js
- Backend: Java, Spring Boot, Maven
- Infra: Azure SQL, Azure Cognitive Services (Face), Azure App Service, Bicep

## Ejecución local (alto nivel)
1. Base de datos (Azure SQL o SQL Server local):
   - Ejecuta el script [infra/sql/schema.sql](infra/sql/schema.sql)
2. Backend:
   - Ver [backend/README.md](backend/README.md)
3. Web:
   - Ver [web/README.md](web/README.md)
4. Android:
   - Ver [mobile/README.md](mobile/README.md)

## Configuración (variables sugeridas)
- `AZURE_FACE_ENDPOINT`
- `AZURE_FACE_KEY`
- `SQLSERVER_HOST`, `SQLSERVER_DB`, `SQLSERVER_USER`, `SQLSERVER_PASSWORD`

> Nota: Este repositorio es un **esqueleto de monorepo** (estructura + archivos base). Cada módulo incluye instrucciones para bootstrap/arranque local.
