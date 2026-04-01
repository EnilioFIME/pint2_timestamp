# Arquitectura — FieldCheck

## Contexto
FieldCheck es un sistema de control de asistencia para obra, con registro de entradas/salidas vía NFC y verificación biométrica facial bajo condiciones sospechosas.

## Componentes
- **App Android (`mobile/`)**: captura eventos NFC y envía registros al backend. Si el backend marca sospecha, la app guía el flujo de captura facial.
- **App Web (`web/`)**: administra cercos geográficos, catálogos y reportes.
- **Backend (`backend/`)**: API REST. Valida, persiste y aplica heurísticas; cuando aplica, orquesta Azure Face API.
- **Persistencia**: Azure SQL.
- **Infra (`infra/`)**: IaC con Bicep y esquema SQL base.

## Flujo principal (NFC → registro)
1. Checador lee tarjeta NFC (Android).
2. App envía al backend: identificador de tarjeta + sitio + tipo (CLOCK_IN/CLOCK_OUT) + metadata (hora, dispositivo, ubicación si aplica).
3. Backend:
   - Resuelve empleado por `numero_tarjeta_nfc`.
   - Evalúa heurísticas (patrones anómalos, ubicación fuera de cerco, duplicados, etc.).
   - Persiste el registro preliminar.
4. Si sospechoso:
   - Backend responde indicando que requiere biometría.
   - App captura foto/frames, el backend valida contra Face API.
   - Backend actualiza `resultado_biometria` y `confianza_azure`.

## Heurísticas (ejemplos)
- Registro fuera de cerco
- Registro repetido en ventana corta
- Secuencias imposibles (CLOCK_OUT sin CLOCK_IN, etc.)
- Dispositivo no autorizado (si se modela)

## Seguridad (baseline)
- Secretos solo en backend (Azure Face key, credenciales DB).
- TLS en tránsito.
- Auditoría: conservar campos `sospechoso`, `requirio_biometria`, `resultado_biometria`, `confianza_azure`.

## Infraestructura
- Bicep base en [infra/azure/main.bicep](infra/azure/main.bicep)
- SQL schema base en [infra/sql/schema.sql](infra/sql/schema.sql)
