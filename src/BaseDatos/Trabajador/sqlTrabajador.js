// Consultas en la base de datos Trabajador

exports.ConsultarTrabajador = `
    SELECT IdTra , Nombre 
    FROM Trabajador 
    WHERE Matricula = ? AND Password = AES_ENCRYPT(?,'${process.env.KEY_SECRET_BD}')
`

exports.ConsultarAdministrador = 'SELECT IdAdm FROM Administrador WHERE IdTra = ?'

exports.ConsultarPaginasTrabajador = `
    SELECT Seccion.Nombre 
    FROM TrabajadorSeccion , Seccion 
    WHERE TrabajadorSeccion.IdTra = ? AND Seccion.IdSec = TrabajadorSeccion.IdSec
`

exports.Avisos = `
    Select aviso.Descripcion , i.Nombre 
    FROM aviso , ( (SELECT s.Nombre , seccionaviso.IdAvi 
        FROM seccionaviso , ( (SELECT Seccion.IdSec , Nombre 
            FROM Seccion , ( (SELECT IdSec 
                FROM trabajadorseccion 
                WHERE IdTra = ?) AS st) 
            WHERE Seccion.IdSec = st.IdSec) AS s) 
        WHERE seccionaviso.IdSec = s.IdSec) AS i ) 
    WHERE aviso.IdAvi = i.IdAvi GROUP BY aviso.IdAvi ASC
`

exports.CrearTrabajador = `
    INSERT INTO trabajador 
        VALUES (0,?,?,?,?,AES_ENCRYPT(?,'${process.env.KEY_SECRET_BD}'))
`

exports.AgregarSeccionTrabajador = 'INSERT INTO TrabajadorSeccion VALUES (0,?,?)'

exports.AgregarPermisoAdministrador = 'INSERT INTO Administrador VALUES (0,?)'

exports.InformacionTrabajador = `
    SELECT IdTra , Nombre , Apellido1 , Apellido2 , Matricula 
        FROM Trabajador WHERE Matricula = ?
`

exports.EliminarSecciones = "DELETE FROM TrabajadorSeccion WHERE IdTra = ?"

exports.EliminarPermisoAdministrador = "DELETE FROM Administrador WHERE IdTra = ?"

exports.EliminarTrabajador = "DELETE FROM Trabajador WHERE IdTra = ?"

exports.ModificarDatosTrabajador = `
    UPDATE Trabajador Set Nombre = ? , Apellido1 = ? , Apellido2 = ? , Matricula = ? 
        WHERE IdTra = ?
`

exports.ModificarTodoTrabajador = `
    UPDATE Trabajador 
        Set Nombre = ? , Apellido1 = ? , Apellido2 = ? , 
        Matricula = ? , Password = AES_ENCRYPT(?,'${process.env.KEY_SECRET_BD}') 
        WHERE IdTra = ?
`

