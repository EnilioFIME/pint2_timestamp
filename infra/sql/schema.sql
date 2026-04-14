-- ==============================================================================
-- Azure SQL / SQL Server (T-SQL)
-- Esquema base para FieldCheck (control de asistencia)
-- ==============================================================================

-- ==============================================================================
-- ELIMINACION DE TABLAS 
-- ==============================================================================
IF OBJECT_ID('dbo.Asistencias', 'U') IS NOT NULL DROP TABLE dbo.Asistencias;
IF OBJECT_ID('dbo.Usuarios', 'U') IS NOT NULL DROP TABLE dbo.Usuarios;
IF OBJECT_ID('dbo.Proyectos', 'U') IS NOT NULL DROP TABLE dbo.Proyectos;
IF OBJECT_ID('dbo.TarjetasNFC', 'U') IS NOT NULL DROP TABLE dbo.TarjetasNFC;
IF OBJECT_ID('dbo.DatosBiometricos', 'U') IS NOT NULL DROP TABLE dbo.DatosBiometricos;
IF OBJECT_ID('dbo.Frentes', 'U') IS NOT NULL DROP TABLE dbo.Frentes;
IF OBJECT_ID('dbo.CercosGeograficos', 'U') IS NOT NULL DROP TABLE dbo.CercosGeograficos;
GO

-- ==============================================================================
-- 1. TABLAS INDEPENDIENTES
-- ==============================================================================

-- Tabla para Tarjetas NFC
CREATE TABLE dbo.TarjetasNFC (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_TarjetasNFC_uuid UNIQUE,
    nfc_uuid NVARCHAR(100) NOT NULL CONSTRAINT UQ_TarjetasNFC_nfc_uuid UNIQUE,
    status BIT NOT NULL CONSTRAINT DF_TarjetasNFC_status DEFAULT (1),
    created_at DATETIME2(3) NOT NULL CONSTRAINT DF_TarjetasNFC_created_at DEFAULT (SYSUTCDATETIME())
);
GO

-- Tabla para Datos Biométricos (Entidad basada en IdPersonaAzure)
CREATE TABLE dbo.DatosBiometricos (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_DatosBiometricos_uuid UNIQUE,
    id_persona_azure NVARCHAR(100) NOT NULL CONSTRAINT UQ_DatosBiometricos_id_persona_azure UNIQUE,
    status BIT NOT NULL CONSTRAINT DF_DatosBiometricos_status DEFAULT (1),
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_DatosBiometricos_timestamp DEFAULT (SYSUTCDATETIME())
);
GO

-- Tabla para Frentes
CREATE TABLE dbo.Frentes (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_Frentes_uuid UNIQUE,
    nombre NVARCHAR(200) NOT NULL,
    status BIT NOT NULL CONSTRAINT DF_Frentes_status DEFAULT (1),
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_Frentes_timestamp DEFAULT (SYSUTCDATETIME())
);
GO

-- Tabla para Cercos Geograficos
CREATE TABLE dbo.CercosGeograficos (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_CercosGeograficos_uuid UNIQUE,
    -- Coordenadas del cerco geográfico.
    latitud DECIMAL(10,7) NOT NULL CONSTRAINT CHK_CercosGeograficos_latitud CHECK (latitud BETWEEN -90.0 AND 90.0),
    longitud DECIMAL(10,7) NOT NULL CONSTRAINT CHK_CercosGeograficos_longitud CHECK (longitud BETWEEN -180.0 AND 180.0),
    radio_metros DECIMAL(6,2) NOT NULL CONSTRAINT CHK_CercosGeograficos_radio CHECK (radio_metros > 0),
    status BIT NOT NULL CONSTRAINT DF_CercosGeograficos_status DEFAULT (1),
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_CercosGeograficos_timestamp DEFAULT (SYSUTCDATETIME())
);
GO

-- ==============================================================================
-- 2. TABLAS CON DEPENDENCIAS DE PRIMER NIVEL
-- ==============================================================================

-- Tabla principal de Usuarios
CREATE TABLE dbo.Usuarios (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_Usuarios_uuid UNIQUE,
    tarjeta_nfc_id BIGINT NULL,
    dato_biometrico_id BIGINT NULL,
    rol NVARCHAR(20) NOT NULL CONSTRAINT CHK_Usuarios_rol CHECK (rol IN ('Empleado', 'Checador', 'Administrador')),
    numero_empleado NVARCHAR(6) NOT NULL CONSTRAINT UQ_Usuarios_numero_empleado UNIQUE,
    email NVARCHAR(60) NULL CONSTRAINT UQ_Usuarios_email UNIQUE,
    apellido NVARCHAR(100) NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    status BIT NOT NULL CONSTRAINT DF_Usuarios_status DEFAULT (1),
    modified_by NVARCHAR(60) NULL,
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_Usuarios_timestamp DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT FK_Usuarios_TarjetasNFC FOREIGN KEY (tarjeta_nfc_id) 
        REFERENCES dbo.TarjetasNFC(id) ON DELETE SET NULL,
    CONSTRAINT FK_Usuarios_DatosBiometricos FOREIGN KEY (dato_biometrico_id) 
        REFERENCES dbo.DatosBiometricos(id) ON DELETE SET NULL,

    -- REGLAS DE NEGOCIO
    CONSTRAINT CHK_Usuarios_reglas_rol CHECK (
        (rol = 'Empleado' AND email IS NULL AND (dato_biometrico_id IS NOT NULL OR tarjeta_nfc_id IS NOT NULL)) OR 
        (rol IN ('Checador', 'Administrador') AND email IS NOT NULL)
    )
);
GO

CREATE INDEX IX_Usuarios_numero_empleado ON dbo.Usuarios (numero_empleado);
CREATE INDEX IX_Usuarios_rol ON dbo.Usuarios (rol);
GO

-- Tabla para Proyectos
CREATE TABLE dbo.Proyectos (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_Proyectos_uuid UNIQUE,
    frente_id BIGINT NOT NULL,
    cerco_id BIGINT NULL CONSTRAINT UQ_Proyectos_cerco_id UNIQUE,
    nombre NVARCHAR(200) NOT NULL,
    status BIT NOT NULL CONSTRAINT DF_Proyectos_status DEFAULT (1),
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_Proyectos_timestamp DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT FK_Proyectos_Frentes FOREIGN KEY (frente_id) 
        REFERENCES dbo.Frentes(id) ON DELETE NO ACTION,
    CONSTRAINT FK_Proyectos_CercosGeograficos FOREIGN KEY (cerco_id) 
        REFERENCES dbo.CercosGeograficos(id) ON DELETE SET NULL
);
GO

CREATE INDEX IX_Proyectos_frente_id ON dbo.Proyectos (frente_id);
GO

-- ==============================================================================
-- 3. TABLA TRANSACCIONAL
-- ==============================================================================

-- Tabla para el registro de Asistencias
CREATE TABLE dbo.Asistencias (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    uuid NVARCHAR(36) NOT NULL CONSTRAINT UQ_Asistencias_uuid UNIQUE,
    usuario_id BIGINT NOT NULL,
    proyecto_id BIGINT NOT NULL,
    tipo_verificacion NVARCHAR(20) NOT NULL,
    metodo NVARCHAR(20) NOT NULL,
    confianza DECIMAL(5,2) NULL CONSTRAINT CHK_Asistencias_confianza CHECK (confianza BETWEEN 0.0 AND 100.0),
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_Asistencias_timestamp DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT FK_Asistencias_Usuarios FOREIGN KEY (usuario_id) 
        REFERENCES dbo.Usuarios(id) ON DELETE NO ACTION,
    CONSTRAINT FK_Asistencias_Proyectos FOREIGN KEY (proyecto_id) 
        REFERENCES dbo.Proyectos(id) ON DELETE NO ACTION
);
GO

CREATE INDEX IX_Asistencias_usuario_timestamp ON dbo.Asistencias (usuario_id, [timestamp] DESC);
CREATE INDEX IX_Asistencias_proyecto_timestamp ON dbo.Asistencias (proyecto_id, [timestamp] DESC);
GO
