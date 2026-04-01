# mobile — App Android (Checadores)

## Propósito
Aplicación Android usada por residentes de obra (checadores) para registrar asistencia (**CLOCK_IN/CLOCK_OUT**) mediante lectura de tarjetas **NFC**. Cuando el motor de heurísticas identifica un registro sospechoso, se solicita **verificación biométrica facial** integrando **Azure Face API**.

## Tecnologías
- Android (Java/Kotlin)
- NFC (Android NFC API)
- Cámara / captura facial
- Integración con API REST del backend

## Estructura relevante
- `app/src/main/java/com/fieldcheck/nfc`: lectura/parseo de tarjetas NFC
- `app/src/main/java/com/fieldcheck/biometric`: captura facial + flujo de verificación
- `app/src/main/java/com/fieldcheck/ui`: pantallas

## Cómo ejecutarlo localmente
Este módulo es un **esqueleto** de estructura.

1. Recomendado: inicializa un proyecto Android real dentro de `mobile/` usando Android Studio:
   - "New Project" → selecciona plantilla (p. ej. Empty Activity)
   - Asegura que el `applicationId` y paquetes usen `com.fieldcheck`
2. Configura el backend local o remoto:
   - Define la URL base del backend (p. ej. `BACKEND_BASE_URL` en `BuildConfig` o `local.properties`)
3. Ejecuta:
   - Abre `mobile/` en Android Studio y usa "Run" sobre un dispositivo/emulador con NFC (o usa un lector externo si aplica)

## Variables sugeridas
- Endpoint backend: `BACKEND_BASE_URL`
- Azure Face (normalmente el backend maneja la llave): no debe ir en cliente

> Recomendación: nunca embebas `AZURE_FACE_KEY` en la app; el backend debe orquestar Face API.
