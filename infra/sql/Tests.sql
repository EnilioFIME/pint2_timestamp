-- ==============================================================================
-- SCRIPT DE PRUEBAS PARA CONSTRAINTS E INTEGRIDAD DE DATOS
-- Nota: Para que este script funcione correctamente, la base de datos ya debe 
-- tener el esquema final cargado y el Dummy Data.
-- ==============================================================================
SET NOCOUNT ON;
PRINT '=======================================================';
PRINT 'INICIANDO BATERÍA DE PRUEBAS DE CONSTRAINTS (TESTING)...';
PRINT '=======================================================';

-- ------------------------------------------------------------------------------
-- TEST 1: UNIQUE Constraint en TarjetasNFC (NfcUid)
-- Propósito: Probar que no se puedan registrar dos tarjetas físicas con el mismo chip.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.TarjetasNFC (UUID, NfcUid) VALUES (NEWID(), 'CHIP-DUPLICADO-123');
    INSERT INTO dbo.TarjetasNFC (UUID, NfcUid) VALUES (NEWID(), 'CHIP-DUPLICADO-123'); -- Debe fallar
    PRINT 'FALLO TEST 1: Se permitió insertar un NfcUid duplicado.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 1 (UNIQUE NfcUid): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 2: CHECK Constraint en CercosGeograficos (Latitud Límite)
-- Propósito: Probar que la latitud no sobrepase los 90.0 grados.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.CercosGeograficos (UUID, Latitud, Longitud, RadioMetros)
    VALUES (NEWID(), 95.0000000, -99.0000000, 150.50); -- Debe fallar (95.0 > 90.0)
    PRINT 'FALLO TEST 2: Se permitió una Latitud inválida.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 2 (CHK_Cercos_Latitud): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 3: CHECK Constraint en CercosGeograficos (RadioMetros Negativo)
-- Propósito: Probar que el radio del cerco no pueda ser negativo o cero.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.CercosGeograficos (UUID, Latitud, Longitud, RadioMetros)
    VALUES (NEWID(), 19.0000000, -99.0000000, -10.00); -- Debe fallar
    PRINT 'FALLO TEST 3: Se permitió un RadioMetros negativo.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 3 (CHK_Cercos_Radio): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 4: CHECK Constraint en Usuarios (Rol Inválido)
-- Propósito: Verificar que solo se acepten los 3 roles predefinidos del negocio.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Usuarios (UUID, Rol, NumeroEmpleado, Apellido, Nombre)
    VALUES (NEWID(), 'Visitante', '999999', 'Perez', 'Juan'); -- 'Visitante' no existe
    PRINT 'FALLO TEST 4: Se permitió un Rol inventado.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 4 (CHK_Usuarios_Rol): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 5: CHECK Constraint en Usuarios (Regla de Negocio: Empleado CON Email)
-- Propósito: Asegurar que si el rol es 'Empleado', NO debe tener email.
-- ------------------------------------------------------------------------------
BEGIN TRY
    -- Usamos IdTarjetasNFC = 1 asumiendo que ya existe por el dummy data
    INSERT INTO dbo.Usuarios (UUID, IdTarjetasNFC, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 1, 'Empleado', '888888', 'empleado@empresa.com', 'Lopez', 'Maria'); -- Debe fallar
    PRINT 'FALLO TEST 5: Se permitió crear un Empleado con correo electrónico.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 5 (CHK_Usuarios_Reglas_Rol - Empleado): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 6: CHECK Constraint en Usuarios (Regla de Negocio: Administrador SIN Email)
-- Propósito: Asegurar que si el rol es 'Administrador', ES OBLIGATORIO el email.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Usuarios (UUID, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 'Administrador', '777777', NULL, 'Gomez', 'Carlos'); -- Debe fallar
    PRINT 'FALLO TEST 6: Se permitió un Administrador sin correo electrónico.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 6 (CHK_Usuarios_Reglas_Rol - Admin): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 7: Índice Único Filtrado (Filtered Index) en Usuarios (Duplicar Email)
-- Propósito: Validar que 2 administradores no puedan usar el mismo correo.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Usuarios (UUID, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 'Administrador', '666666', 'unico@empresa.com', 'Prueba', 'A');
    
    INSERT INTO dbo.Usuarios (UUID, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 'Checador', '555555', 'unico@empresa.com', 'Prueba', 'B'); -- Falla
    PRINT 'FALLO TEST 7: Se permitió registrar un correo electrónico duplicado.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 7 (UNIQUE INDEX UQ_Usuarios_Email): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 8: Índice Único Filtrado en Usuarios (Múltiples NULLs)
-- Propósito: Validar que la base de datos SÍ permita infinitos NULLs para Empleados.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Usuarios (UUID, IdTarjetasNFC, IdDatosBiometricos, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 1, 1, 'Empleado', '444444', NULL, 'Empleado', 'Prueba1');
    
    -- Se agregó IdDatosBiometricos = 2 para cumplir con el CHECK constraint
    INSERT INTO dbo.Usuarios (UUID, IdTarjetasNFC, IdDatosBiometricos, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 2, 2, 'Empleado', '333333', NULL, 'Empleado', 'Prueba2'); 

    PRINT 'EXITO TEST 8: Se permitió insertar múltiples Empleados con Email en NULL (El índice filtrado funcionó).';
END TRY
BEGIN CATCH
    PRINT 'FALLO TEST 8: La base de datos rechazó los valores NULL múltiples: ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 9: UNIQUE Constraint en Proyectos (IdCerco)
-- Propósito: Garantizar la relación 1:1 estricta entre Cerco y Proyecto.
-- ------------------------------------------------------------------------------
BEGIN TRY
    -- Intentamos asignar el Cerco = 1 a un nuevo proyecto (Asumiendo que el Dummy Data ya lo usó)
    INSERT INTO dbo.Proyectos (UUID, IdFrente, IdCerco, Nombre)
    VALUES (NEWID(), 1, 1, 'Proyecto Invasor de Cerco'); -- Debe fallar
    PRINT 'FALLO TEST 9: Se permitió asignar un mismo cerco geográfico a dos proyectos.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 9 (UQ_Proyectos_IdCerco): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 10: CHECK Constraint en Registros (TipoRegistro Inválido)
-- Propósito: Probar que una asistencia solo pueda ser "Entrada" o "Salida".
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Registros (UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza)
    VALUES (NEWID(), 1, 1, 'Face_AWS', 'Descanso', 90.0); -- Falla, "Descanso" no está permitido
    PRINT 'FALLO TEST 10: Se permitió registrar un TipoRegistro inválido.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 10 (CHK_Registros_Tipo): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 11: CHECK Constraint en Registros (Confianza fuera de rango)
-- Propósito: Asegurar que el score de AWS o NFC siempre esté entre 0 y 100.
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Registros (UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza)
    VALUES (NEWID(), 1, 1, 'Face_AWS', 'Entrada', 105.5); -- Falla, 105.5 > 100.0
    PRINT 'FALLO TEST 11: Se permitió un score de Confianza superior a 100.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 11 (CHK_Registros_Confianza): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 12: FOREIGN KEY Constraint en Registros (IdUsuario Inexistente)
-- Propósito: Comprobar la integridad referencial (no se puede checar un empleado fantasma).
-- ------------------------------------------------------------------------------
BEGIN TRY
    INSERT INTO dbo.Registros (UUID, IdUsuario, IdProyecto, TipoVerificacion, TipoRegistro, Confianza)
    VALUES (NEWID(), 999999, 1, 'Tarjeta_NFC', 'Entrada', 100.0); -- Falla, Id 999999 no existe
    PRINT 'FALLO TEST 12: Integridad Referencial rota. Permitió registrar asistencia a un Id falso.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 12 (FK_Registros_Usuarios): ' + ERROR_MESSAGE();
END CATCH

-- ------------------------------------------------------------------------------
-- TEST 13: UNIQUE Constraint en Usuarios (NumeroEmpleado)
-- Propósito: Probar que 2 personas no puedan compartir la misma matrícula/número.
-- ------------------------------------------------------------------------------
BEGIN TRY
    -- El empleado "000001" se generó en tu Dummy Data
    INSERT INTO dbo.Usuarios (UUID, IdTarjetasNFC, Rol, NumeroEmpleado, Email, Apellido, Nombre)
    VALUES (NEWID(), 3, 'Empleado', '000001', NULL, 'Clon', 'Sr');
    PRINT 'FALLO TEST 13: Se permitió crear un usuario con Número de Empleado duplicado.';
END TRY
BEGIN CATCH
    PRINT 'EXITO TEST 13 (UQ_Usuarios_NumeroEmpleado): ' + ERROR_MESSAGE();
END CATCH

PRINT '=======================================================';
PRINT 'BATERÍA DE PRUEBAS FINALIZADA.';
PRINT '=======================================================';
GO
