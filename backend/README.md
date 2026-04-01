# backend — API REST (Spring Boot)

## Propósito
Capa intermedia que:
- Recibe registros NFC desde la app móvil
- Ejecuta el motor de **heurísticas** para detectar registros sospechosos
- Orquesta llamadas a **Azure Face API** cuando aplica
- Persiste información en **Azure SQL**
- Expone endpoints REST para la app web y la app móvil

## Tecnologías
- Java + Spring Boot
- Maven
- Persistencia: Spring Data JPA + SQL Server (Azure SQL)
- Integración Azure (Face API) vía llamadas HTTP desde `azure/`

## Estructura relevante
- `src/main/java/com/fieldcheck/controller`: endpoints REST
- `src/main/java/com/fieldcheck/service`: casos de uso
- `src/main/java/com/fieldcheck/heuristics`: reglas/score de sospecha
- `src/main/java/com/fieldcheck/repository`: acceso a datos
- `src/main/java/com/fieldcheck/model`: entidades y modelos
- `src/main/java/com/fieldcheck/azure`: clientes/adaptadores de Azure

## Cómo ejecutarlo localmente
Este módulo es un **esqueleto** (estructura + `pom.xml`). Para hacerlo ejecutable:

1. Requisitos:
   - JDK 21
   - Maven 3.9+
   - Acceso a SQL Server (Azure SQL o local)
2. Base de datos:
   - Ejecuta [infra/sql/schema.sql](infra/sql/schema.sql)
3. Configuración:
   - Define variables de entorno (ejemplo):
     - `SQLSERVER_HOST`, `SQLSERVER_DB`, `SQLSERVER_USER`, `SQLSERVER_PASSWORD`
     - `AZURE_FACE_ENDPOINT`, `AZURE_FACE_KEY`
4. Arranque:
   - `cd backend`
   - `mvn -q test`
   - `mvn spring-boot:run`

> Recomendación: el backend debe ser el único lugar con secretos (Face API key, credenciales DB).
