// Consultas a la base de datos Usuarios
exports.RegistroEntradas = `
SELECT IdPar_NomVis.Nombre , Asistencia.Entrada , Asistencia.Salida , Asistencia.Fecha 
FROM Asistencia , ((SELECT Id_Vis_Par.IdPar , Visitante.Nombre 
    FROM Visitante , ((SELECT IdPar , IdVis 
        FROM parentesco) as Id_Vis_Par) 
    WHERE Id_Vis_Par.IdVis = Visitante.IdVis) as IdPar_NomVis) 
WHERE IdPar_NomVis.IdPar = Asistencia.IdPar
`

exports.AgregarPaciente = 'INSERT INTO Paciente VALUE (0,?,?,?,?,?)'

exports.ConsultarVisitante = `
    SELECT IdVis , AES_DECRYPT(Code, '${process.env.KEY_SECRET_BD}') as Code 
    FROM Visitante 
    WHERE CURP = ?
`

exports.AgregarVisitante = `INSERT INTO Visitante VALUE (0,?,?,?,?,AES_ENCRYPT(?,'${process.env.KEY_SECRET_BD}'))`

exports.AgregarParentesco = 'INSERT INTO Parentesco VALUE (0,?,?)'

exports.VerificarParentescoES = 'SELECT IdVis FROM Parentesco WHERE IdPac = ? AND IdPar = ?'

exports.VerificarCodigoVisitante = `
    SELECT IdVis 
    FROM Visitante 
    WHERE IdVis = ? AND Code = AES_ENCRYPT(?,'${process.env.KEY_SECRET_BD}')
`

exports.ObtenerDatosVisitante = `
    SELECT Nombre , Apellido1 , Apellido2 FROM Visitante WHERE IdVis = ?
`

exports.VerificarVisita = `
    SELECT IdAsis 
    FROM Asistencia , ((SELECT IdPar 
        FROM Parentesco 
        WHERE IdPac = ?) as familiares) 
    WHERE familiares.IdPar = Asistencia.IdPar AND Fecha = ?
`

exports.RegistrarAsistencia = `INSERT INTO Asistencia(IdAsis,Entrada,Fecha,IdPar) VALUES (0,?,?,?)`

exports.ObtenerIdAsistencia = `SELECT IdAsis FROM Asistencia WHERE IdPar = ? AND Fecha = ?`

exports.VerificarValorFechaSalida = `SELECT Salida FROM Asistencia WHERE IdAsis = ?`

exports.RegistrarSalida = `UPDATE Asistencia Set Salida = ? WHERE IdAsis = ?`

exports.ObtenerDatosPaciente = `SELECT Nombre , Apellido1 , Apellido2 , NSS FROM Paciente WHERE IdPac = ?`