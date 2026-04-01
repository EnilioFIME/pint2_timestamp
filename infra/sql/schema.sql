-- Azure SQL / SQL Server (T-SQL)
-- Esquema base para FieldCheck (control de asistencia)

IF OBJECT_ID('dbo.Registros', 'U') IS NOT NULL DROP TABLE dbo.Registros;
IF OBJECT_ID('dbo.Sitios', 'U') IS NOT NULL DROP TABLE dbo.Sitios;
IF OBJECT_ID('dbo.Empleados', 'U') IS NOT NULL DROP TABLE dbo.Empleados;
GO

CREATE TABLE dbo.Empleados (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre NVARCHAR(200) NOT NULL,
    numero_tarjeta_nfc NVARCHAR(64) NOT NULL,
    foto_url NVARCHAR(2048) NULL,
    activo BIT NOT NULL CONSTRAINT DF_Empleados_activo DEFAULT (1),
    CONSTRAINT UQ_Empleados_numero_tarjeta_nfc UNIQUE (numero_tarjeta_nfc)
);
GO

CREATE TABLE dbo.Sitios (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nombre NVARCHAR(200) NOT NULL,
    -- Coordenadas del cerco geográfico. Recomendado: JSON (GeoJSON / polígono) o WKT.
    coordenadas_cerco NVARCHAR(MAX) NOT NULL,
    activo BIT NOT NULL CONSTRAINT DF_Sitios_activo DEFAULT (1)
);
GO

CREATE TABLE dbo.Registros (
    id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    empleado_id BIGINT NOT NULL,
    sitio_id BIGINT NOT NULL,
    tipo NVARCHAR(16) NOT NULL,
    [timestamp] DATETIME2(3) NOT NULL CONSTRAINT DF_Registros_timestamp DEFAULT (SYSUTCDATETIME()),

    requirio_biometria BIT NOT NULL CONSTRAINT DF_Registros_requirio_biometria DEFAULT (0),
    resultado_biometria NVARCHAR(32) NULL,
    confianza_azure DECIMAL(5,4) NULL,

    sospechoso BIT NOT NULL CONSTRAINT DF_Registros_sospechoso DEFAULT (0),

    CONSTRAINT FK_Registros_Empleados FOREIGN KEY (empleado_id) REFERENCES dbo.Empleados(id),
    CONSTRAINT FK_Registros_Sitios FOREIGN KEY (sitio_id) REFERENCES dbo.Sitios(id),
    CONSTRAINT CK_Registros_tipo CHECK (tipo IN ('CLOCK_IN', 'CLOCK_OUT')),
    CONSTRAINT CK_Registros_confianza_azure CHECK (confianza_azure IS NULL OR (confianza_azure >= 0 AND confianza_azure <= 1))
);
GO

CREATE INDEX IX_Registros_empleado_timestamp ON dbo.Registros (empleado_id, [timestamp] DESC);
CREATE INDEX IX_Registros_sitio_timestamp ON dbo.Registros (sitio_id, [timestamp] DESC);
GO
