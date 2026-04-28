-- ==============================================================================
-- ELIMINACIÓN DINAMICA DE LLAVES FORANEAS Y OBJETOS
-- ==============================================================================
DECLARE @sql NVARCHAR(MAX) = N'';

-- Destruir llaves foraneas para evitar bloqueos
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + 
               '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
               ' DROP CONSTRAINT ' + QUOTENAME(name) + ';' + CHAR(13)
FROM sys.foreign_keys
WHERE referenced_object_id IN (
    OBJECT_ID('dbo.Proyectos'), OBJECT_ID('dbo.CercosGeograficos'),
    OBJECT_ID('dbo.Registros'), OBJECT_ID('dbo.Usuarios'),
    OBJECT_ID('dbo.TarjetasNFC'), OBJECT_ID('dbo.DatosBiometricosAWS'),
    OBJECT_ID('dbo.Frentes')
);
EXEC sp_executesql @sql;
GO

-- Destruir Vistas y Tablas
IF OBJECT_ID('dbo.vw_Asistencias', 'V') IS NOT NULL DROP VIEW dbo.vw_Asistencias;
IF OBJECT_ID('dbo.Registros', 'U') IS NOT NULL DROP TABLE dbo.Registros;
IF OBJECT_ID('dbo.Usuarios', 'U') IS NOT NULL DROP TABLE dbo.Usuarios;
IF OBJECT_ID('dbo.Proyectos', 'U') IS NOT NULL DROP TABLE dbo.Proyectos;
IF OBJECT_ID('dbo.CercosGeograficos', 'U') IS NOT NULL DROP TABLE dbo.CercosGeograficos;
IF OBJECT_ID('dbo.Frentes', 'U') IS NOT NULL DROP TABLE dbo.Frentes;
IF OBJECT_ID('dbo.DatosBiometricosAWS', 'U') IS NOT NULL DROP TABLE dbo.DatosBiometricosAWS;
IF OBJECT_ID('dbo.TarjetasNFC', 'U') IS NOT NULL DROP TABLE dbo.TarjetasNFC;
GO

-- ==============================================================================
-- TABLAS MAESTRAS / CATALOGOS
-- ==============================================================================

CREATE TABLE dbo.TarjetasNFC (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(36) NOT NULL CONSTRAINT UQ_TarjetasNFC_UUID UNIQUE,
    NfcUid NVARCHAR(100) NOT NULL CONSTRAINT UQ_TarjetasNFC_NfcUid UNIQUE,
    Status BIT NOT NULL CONSTRAINT DF_TarjetasNFC_Status DEFAULT (1),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_TarjetasNFC_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_TarjetasNFC_UpdatedAt DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE dbo.DatosBiometricosAWS (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(36) NOT NULL CONSTRAINT UQ_DatosBiometricosAWS_UUID UNIQUE,
    RekognitionFaceId NVARCHAR(100) NOT NULL CONSTRAINT UQ_DatosBiometricosAWS_FaceId UNIQUE,
    Status BIT NOT NULL CONSTRAINT DF_DatosBiometricosAWS_Status DEFAULT (1),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_DatosBiometricosAWS_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_DatosBiometricosAWS_UpdatedAt DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE dbo.Frentes (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(36) NOT NULL CONSTRAINT UQ_Frentes_UUID UNIQUE,
    Nombre NVARCHAR(200) NOT NULL,
    Status BIT NOT NULL CONSTRAINT DF_Frentes_Status DEFAULT (1),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Frentes_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Frentes_UpdatedAt DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE dbo.CercosGeograficos (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(36) NOT NULL CONSTRAINT UQ_CercosGeograficos_UUID UNIQUE,
    Latitud DECIMAL(10,7) NOT NULL CONSTRAINT CHK_Cercos_Latitud CHECK (Latitud BETWEEN -90.0 AND 90.0),
    Longitud DECIMAL(10,7) NOT NULL CONSTRAINT CHK_Cercos_Longitud CHECK (Longitud BETWEEN -180.0 AND 180.0),
    RadioMetros DECIMAL(6,2) NOT NULL CONSTRAINT CHK_Cercos_Radio CHECK (RadioMetros > 0),
    Status BIT NOT NULL CONSTRAINT DF_CercosGeograficos_Status DEFAULT (1),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Cercos_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Cercos_UpdatedAt DEFAULT (SYSUTCDATETIME())
);

CREATE TABLE dbo.Usuarios (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(36) NOT NULL CONSTRAINT UQ_Usuarios_UUID UNIQUE,
    IdTarjetasNFC BIGINT NULL,
    IdDatosBiometricos BIGINT NULL,
    Rol NVARCHAR(20) NOT NULL CONSTRAINT CHK_Usuarios_Rol CHECK (Rol IN ('Empleado', 'Checador', 'Administrador')),
    NumeroEmpleado NVARCHAR(6) NOT NULL CONSTRAINT UQ_Usuarios_NumeroEmpleado UNIQUE,
    Email NVARCHAR(60) NULL, 
    Apellido NVARCHAR(100) NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Status BIT NOT NULL CONSTRAINT DF_Usuarios_Status DEFAULT (1),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Usuarios_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Usuarios_UpdatedAt DEFAULT (SYSUTCDATETIME())

    CONSTRAINT FK_Usuarios_TarjetasNFC FOREIGN KEY (IdTarjetasNFC) 
        REFERENCES dbo.TarjetasNFC(Id) ON DELETE SET NULL,
    CONSTRAINT FK_Usuarios_DatosBiometricos FOREIGN KEY (IdDatosBiometricos) 
        REFERENCES dbo.DatosBiometricosAWS(Id) ON DELETE SET NULL,
    CONSTRAINT CHK_Usuarios_Reglas_Rol CHECK (
        (Rol = 'Empleado' AND Email IS NULL AND (IdDatosBiometricos IS NOT NULL AND IdTarjetasNFC IS NOT NULL)) OR 
        (Rol IN ('Checador', 'Administrador') AND Email IS NOT NULL)
    )
);

CREATE UNIQUE NONCLUSTERED INDEX UQ_Usuarios_Email 
ON dbo.Usuarios (Email) 
WHERE Email IS NOT NULL;

CREATE TABLE dbo.Proyectos (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(36) NOT NULL CONSTRAINT UQ_Proyectos_UUID UNIQUE,
    IdFrente BIGINT NOT NULL,
    IdCerco BIGINT NULL CONSTRAINT UQ_Proyectos_IdCerco UNIQUE,
    Nombre NVARCHAR(200) NOT NULL,
    Status BIT NOT NULL CONSTRAINT DF_Proyectos_Status DEFAULT (1),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Proyectos_CreatedAt DEFAULT (SYSUTCDATETIME()),
    UpdatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Proyectos_UpdatedAt DEFAULT (SYSUTCDATETIME())

    CONSTRAINT FK_Proyectos_Frentes FOREIGN KEY (IdFrente) 
        REFERENCES dbo.Frentes(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Proyectos_Cercos FOREIGN KEY (IdCerco) 
        REFERENCES dbo.CercosGeograficos(Id) ON DELETE SET NULL
);
GO

-- ==============================================================================
-- TABLA TRANSACCIONAL (Hechos puros, Inmutables)
-- ==============================================================================

CREATE TABLE dbo.Registros (
    Id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    UUID NVARCHAR(100) NOT NULL CONSTRAINT UQ_Registros_UUID UNIQUE,
    IdUsuario BIGINT NOT NULL,
    IdProyecto BIGINT NOT NULL,
    TipoVerificacion NVARCHAR(20) NOT NULL,
    TipoRegistro NVARCHAR(20) NOT NULL CONSTRAINT CHK_Registros_Tipo CHECK (TipoRegistro IN ('Entrada', 'Salida')),
    Confianza DECIMAL(5,2) NULL CONSTRAINT CHK_Registros_Confianza CHECK (Confianza BETWEEN 0.0 AND 100.0),
    CreatedAt DATETIME2(3) NOT NULL CONSTRAINT DF_Registros_CreatedAt DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT FK_Registros_Usuarios FOREIGN KEY (IdUsuario) 
        REFERENCES dbo.Usuarios(Id) ON DELETE NO ACTION,
    CONSTRAINT FK_Registros_Proyectos FOREIGN KEY (IdProyecto) 
        REFERENCES dbo.Proyectos(Id) ON DELETE NO ACTION
);
GO


-- ==============================================================================
-- CREACIÓN DE VISTA CONSOLIDADA
-- ==============================================================================

CREATE VIEW dbo.vw_Asistencias AS
SELECT 
    e.UUID,
    e.Id,
    e.IdUsuario,
    e.IdProyecto,
    e.CreatedAt AS Entrada,
    s.CreatedAt AS Salida,
    
    -- LOGICA CONDICIONAL DE ESTADOS
    CASE 
        WHEN s.CreatedAt IS NOT NULL THEN 'Completada'
        WHEN s.CreatedAt IS NULL AND CAST(e.CreatedAt AS DATE) = CAST(SYSUTCDATETIME() AS DATE) THEN 'En Curso'
        ELSE 'Inconsistente'
    END AS Estado,

    -- CALCULO DE HORAS TOTALES
    CAST(DATEDIFF(MINUTE, e.CreatedAt, s.CreatedAt) / 60.0 AS DECIMAL(5,2)) AS HorasTotales

FROM 
    dbo.Registros e

-- OUTER APPLY permite hacer match con la "Salida" más cercana posterior a la "Entrada"
OUTER APPLY (
    SELECT TOP 1 sal.CreatedAt
    FROM dbo.Registros sal
    WHERE sal.IdUsuario = e.IdUsuario
      AND sal.IdProyecto = e.IdProyecto
      AND sal.TipoRegistro = 'Salida'
      AND sal.CreatedAt >= e.CreatedAt
    ORDER BY sal.CreatedAt ASC 
) s
WHERE 
    e.TipoRegistro = 'Entrada';
GO

-- ==============================================================================
-- INDICES DE OPTIMIZACIÓN
-- ==============================================================================
CREATE INDEX IX_Usuarios_NumeroEmpleado ON dbo.Usuarios (NumeroEmpleado);
CREATE INDEX IX_Usuarios_Rol ON dbo.Usuarios (Rol);
CREATE INDEX IX_Proyectos_IdFrente ON dbo.Proyectos (IdFrente);
CREATE INDEX IX_Registros_Usuario_CreatedAt ON dbo.Registros (IdUsuario, CreatedAt DESC);
CREATE INDEX IX_Registros_Proyecto_CreatedAt ON dbo.Registros (IdProyecto, CreatedAt DESC);
GO