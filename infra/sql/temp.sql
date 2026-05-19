SELECT 
    p.Nombre AS NombreProyecto,
    p.Status AS StatusProyecto,
    f.Nombre AS NombreFrente,
    f.Status AS StatusFrente,
    c.Id AS NombreCerco,
    c.Status AS StatusCerco
  FROM dbo.Proyectos p,
       dbo.Frentes f,
       dbo.CercosGeograficos c
    WHERE p.IdFrente = f.Id
      AND p.IdCerco = c.Id

SELECT *
  FROM dbo.Usuarios

SELECT *
  FROM dbo.vw_Asistencias

SELECT *
  FROM dbo.Registros

SELECT *
  FROM dbo.