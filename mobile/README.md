# FieldCheck — Mobile Module (Android)

Módulo Android del sistema **WorkStamp**, sistema de control de asistencia para empleados de campo de una empresa constructora.

## Rol del asistente

Actúa como Arquitecto de software senior y desarrollador senior de Android (Java/Kotlin), Spring Boot y Azure. Enfoque 100% práctico, con sentido de urgencia. Respuestas concisas y precisas. Evita alucinar.

## Descripción del módulo

App Android nativa usada por **checadores** (residentes de obra). Los empleados acercan una tarjeta NFC al dispositivo para registrar su clock-in/clock-out. Cuando el motor de heurísticas del backend detecta un registro sospechoso, la app solicita verificación biométrica facial integrada con Azure Face API.

## Reglas críticas

- Las claves de Azure Face **NUNCA** van en el cliente
- El backend orquesta toda la comunicación con Azure Face API
- La app solo captura la imagen y la envía al backend

## Stack

- **Lenguaje:** Java (principal) / Kotlin
- **Plataforma:** Android nativo
- **NFC:** Android NFC API
- **Biometría:** Cámara + Azure Face API (orquestada por backend)
- **Backend:** Spring Boot REST API
- **Base de datos:** Azure SQL Server

## Estado actual

- Monorepo: `/timestamp`
- Este módulo: `/timestamp/mobile`
- Package: `com.fieldcheck`
- Minimum SDK: API 26 (Android 8.0)
- Build: Kotlin DSL (`build.gradle.kts`)
- Branch activo: `feature/mobile-android-setup`

## Estructura objetivo de paquetes

```
app/src/main/java/com/fieldcheck/
├── nfc/          → lectura y parseo de tarjetas NFC
├── biometric/    → captura facial y flujo de verificación
└── ui/           → pantallas y componentes de interfaz
```

## Próximo paso

Definir la arquitectura de la app y crear la estructura de paquetes base antes de escribir cualquier funcionalidad.
