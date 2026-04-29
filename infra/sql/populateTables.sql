-- ==============================================================================
-- 0. LIMPIEZA DE DATOS PREVIOS (Vacía las tablas y reinicia IDs)
-- ==============================================================================
SET NOCOUNT ON;
PRINT 'Limpiando base de datos...';

DELETE FROM dbo.Registros;
DELETE FROM dbo.Proyectos;
DELETE FROM dbo.Usuarios;
DELETE FROM dbo.CercosGeograficos;
DELETE FROM dbo.Frentes;
DELETE FROM dbo.DatosBiometricosAWS;
DELETE FROM dbo.TarjetasNFC;

DBCC CHECKIDENT ('dbo.Registros', RESEED, 0);
DBCC CHECKIDENT ('dbo.Proyectos', RESEED, 0);
DBCC CHECKIDENT ('dbo.Usuarios', RESEED, 0);
DBCC CHECKIDENT ('dbo.CercosGeograficos', RESEED, 0);
DBCC CHECKIDENT ('dbo.Frentes', RESEED, 0);
DBCC CHECKIDENT ('dbo.DatosBiometricosAWS', RESEED, 0);
DBCC CHECKIDENT ('dbo.TarjetasNFC', RESEED, 0);
PRINT 'Limpieza completada.';

PRINT 'Iniciando generación de datos...';

-- ==============================================================================
-- 1. CREACIÓN DE FRENTES (6 Frentes exactos)
-- ==============================================================================
DECLARE @f INT = 1;
WHILE @f <= 6
BEGIN
    INSERT INTO dbo.Frentes (UUID, Nombre) 
    VALUES (NEWID(), CONCAT('Frente de Obra ', @f));
    
    SET @f = @f + 1;
END
PRINT '6 Frentes generados.';

-- ==============================================================================
-- 2. CREACIÓN DE CERCOS GEOGRÁFICOS Y PROYECTOS (De 1 a 6 por frente)
-- ==============================================================================
DECLARE @frenteId BIGINT, @cercoId BIGINT;
DECLARE @p INT, @numProyectos INT;

DECLARE curFrentes CURSOR FOR SELECT Id FROM dbo.Frentes;
OPEN curFrentes;
FETCH NEXT FROM curFrentes INTO @frenteId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @numProyectos = ABS(CHECKSUM(NEWID())) % 6 + 1;
    SET @p = 1;

    WHILE @p <= @numProyectos
    BEGIN
        INSERT INTO dbo.CercosGeograficos (UUID, Latitud, Longitud, RadioMetros)
        VALUES (NEWID(), 19.0 + RAND(), -99.0 + RAND(), 150.50);
        SET @cercoId = SCOPE_IDENTITY();

        INSERT INTO dbo.Proyectos (UUID, IdFrente, IdCerco, Nombre)
        VALUES (NEWID(), @frenteId, @cercoId, CONCAT('Proyecto ', @frenteId, '-', @p));

        SET @p = @p + 1;
    END
    FETCH NEXT FROM curFrentes INTO @frenteId;
END
CLOSE curFrentes;
DEALLOCATE curFrentes;
PRINT 'Cercos y Proyectos generados.';

-- ==============================================================================
-- 3. CREACIÓN DE MÉTODOS DE ACCESO Y USUARIOS (100 Usuarios)
-- ==============================================================================
DECLARE @u INT = 1;
DECLARE @nfcId BIGINT, @bioId BIGINT;
DECLARE @rol NVARCHAR(20), @email NVARCHAR(60);

WHILE @u <= 100
BEGIN
    INSERT INTO dbo.TarjetasNFC (UUID, NfcUid) VALUES (NEWID(), NEWID());
    SET @nfcId = SCOPE_IDENTITY();

    INSERT INTO dbo.DatosBiometricosAWS (UUID, RekognitionFaceId) VALUES (NEWID(), NEWID());
    SET @bioId = SCOPE_IDENTITY();

    IF @u <= 5 SET @rol = 'Administrador';
    ELSE IF @u <= 20 SET @rol = 'Checador';
    ELSE SET @rol = 'Empleado';

    -- Regla de Negocio Real: Empleados reciben NULL estrictamente.
    IF @rol IN ('Administrador', 'Checador') SET @email = CONCAT('usuario', @u, '@empresa.com');
    ELSE SET @email = NULL;

    INSERT INTO dbo.Usuarios (
        UUID, IdTarjetasNFC, IdDatosBiometricos, Rol, 
        NumeroEmpleado, Email, Apellido, Nombre
    )
    VALUES (
        NEWID(), @nfcId, @bioId, @rol,
        RIGHT('000000' + CAST(@u AS NVARCHAR(6)), 6), @email,
        CONCAT('Apellido', @u), CONCAT('Nombre', @u)
    );

    SET @u = @u + 1;
END
PRINT '100 Usuarios generados respetando el valor NULL para los Empleados.';

-- ==============================================================================
-- 4. REGISTROS / ASISTENCIAS (Con métodos de verificación mixtos)
-- ==============================================================================
DECLARE @usuarioId BIGINT, @proyectoId BIGINT;
DECLARE @dia INT;
DECLARE @fechaBase DATETIME2(3) = CAST(CAST(GETDATE() AS DATE) AS DATETIME2(3)); 
DECLARE @fechaActual DATETIME2(3), @entrada DATETIME2(3), @salida DATETIME2(3);
DECLARE @metodoEntrada NVARCHAR(20), @metodoSalida NVARCHAR(20);

DECLARE curUsuarios CURSOR FOR SELECT Id FROM dbo.Usuarios;
OPEN curUsuarios;
FETCH NEXT FROM curUsuarios INTO @usuarioId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @dia = 1;

    WHILE @dia <= 30
    BEGIN
        SET @fechaActual = DATEADD(DAY, -(@dia), @fechaBase);
        SELECT TOP 1 @proyectoId = Id FROM dbo.Proyectos ORDER BY NEWID();

        -- 1. Decidir método aleatorio para Entrada y Salida (0 = Face_AWS, 1 = Tarjeta_NFC)
        SET @metodoEntrada = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2) = 0 THEN 'Face_AWS' ELSE 'Tarjeta_NFC' END;
        SET @metodoSalida = CASE WHEN (ABS(CHECKSUM(NEWID())) % 2) = 0 THEN 'Face_AWS' ELSE 'Tarjeta_NFC' END;

        -- 2. Registrar Entrada (8:00 AM aprox)
        SET @entrada = DATEADD(MINUTE, ABS(CHECKSUM(NEWID())) % 60, DATEADD(HOUR, 8, @fechaActual));
        INSERT INTO dbo.Registros (UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza, CreatedAt)
        VALUES (
            NEWID(), @usuarioId, @proyectoId, 
            @metodoEntrada, -- Se usa el método aleatorio
            'Entrada', 
            CASE WHEN @metodoEntrada = 'Face_AWS' THEN (90.0 + (RAND() * 9.9)) ELSE 100.0 END, -- NFC siempre tiene 100% de confianza
            @entrada
        );

        -- 3. Registrar Salida (5:00 PM aprox)
        SET @salida = DATEADD(MINUTE, ABS(CHECKSUM(NEWID())) % 60, DATEADD(HOUR, 17, @fechaActual));
        INSERT INTO dbo.Registros (UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza, CreatedAt)
        VALUES (
            NEWID(), @usuarioId, @proyectoId, 
            @metodoSalida, -- Se usa el método aleatorio (que puede ser distinto a la entrada)
            'Salida', 
            CASE WHEN @metodoSalida = 'Face_AWS' THEN (90.0 + (RAND() * 9.9)) ELSE 100.0 END, 
            @salida
        );

        SET @dia = @dia + 1;
    END

    FETCH NEXT FROM curUsuarios INTO @usuarioId;
END
CLOSE curUsuarios;
DEALLOCATE curUsuarios;
PRINT '6,000 Registros (Asistencias de 30 días para 100 usuarios) con métodos mixtos generados exitosamente.';
PRINT 'Poblado de base de datos finalizado.';
GO

-- IRREGULARIDADES PARA PRUEBAS DE VISTA
-- ==============================================================================
-- 1. REGISTRO "EN CURSO" (Entrada el día de hoy, sin salida)
-- ==============================================================================
-- Al usar SYSUTCDATETIME(), la vista detectará que la entrada es de hoy 
-- y la marcará como 'En Curso' automáticamente.
INSERT INTO dbo.Registros (
    UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza, CreatedAt
)
VALUES (
    NEWID(), 
    1,             -- ID de un usuario existente
    1,             -- ID de un proyecto existente
    'Face_AWS',    -- Usando método biométrico
    'Entrada',     -- Solo entrada
    98.50, 
    SYSUTCDATETIME() -- Fecha y hora de HOY
);

-- ==============================================================================
-- 2. REGISTRO "INCONSISTENTE" (Entrada pasada, sin salida)
-- ==============================================================================
-- Al usar DATEADD(DAY, -2, SYSUTCDATETIME()), estamos simulando que el 
-- empleado entró hace 2 días y nunca registró su salida.
INSERT INTO dbo.Registros (
    UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza, CreatedAt
)
VALUES (
    NEWID(), 
    2,             -- ID de otro usuario 
    1,             
    'Tarjeta_NFC', -- Usando tarjeta
    'Entrada',     -- Solo entrada
    100.00, 
    DATEADD(DAY, -2, SYSUTCDATETIME()) -- Fecha de hace 2 días
);