const { mariadb } = require('../../dependencias')
const sqlUsuario = require('./sqlUsuario')

const poolUsuarios = mariadb.createPool({
    host : process.env.HOST_BD,
    port : process.env.PORT_BD,
    user : process.env.USER_BD,
    password : process.env.PWD_BD,
    database : process.env.DATABASE_USUARIOS
})

async function getConnectionUsuarios(){
    try {
        return await poolUsuarios.getConnection()
    } catch (error) {
        if( error.code == 'ER_GET_CONNECTION_TIMEOUT' ){
            console.log( '¡Tiempo de espera para la conexion con la BD agotado!' )
        }
    }
}

exports.obtenerRegistrosEntrada = async () => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.RegistroEntradas )
        conn.end()
        return result
    } catch (error) {
        console.log( error )
        return []
    }
}

exports.crearPaciente = async ( { Nombre , Apellido1 , Apellido2 , NSS , FechaNacimiento } ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.AgregarPaciente , 
            [ Nombre , Apellido1 , Apellido2 , NSS , FechaNacimiento ] )
        conn.end()
        let datosPaciente = { Nombre , Apellido1 , Apellido2 , NSS , Id : result.insertId }
        return { datosPaciente }
    } catch (error) {
        if( error.code )
            return { errorCrearPaciente : `Hay un Error de tipo : ${error.code}` }
        return { errorCrearPaciente : 'Ocurrio un error al registrar al paciente' }
    }
}

exports.verificarVisitante = async ( CURP ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.ConsultarVisitante , [ CURP ] )
        conn.end()
        if( result.length == 1 )
            return { Id : result[0].IdVis , Code1 : result[0].Code.toString() }
        return {}
    } catch (error) {
        if( error.code )
            return { errorVerificarVis : `Hay un Error de tipo : ${error.code}` }
        return { errorVerificarVis : 'Ocurrio un error al registrar al trabajador' }
    }
}

exports.crearVisitante = async ( { Nombre , Apellido1 , Apellido2 , CURP } ) => {
    try {
        let conn = await getConnectionUsuarios()
        let codigoAleatorio = GenerarCodigo()
        let result = await conn.query( sqlUsuario.AgregarVisitante , 
            [ Nombre , Apellido1 , Apellido2 , CURP , codigoAleatorio ] )
        conn.end()
        return { IdVis : result.insertId , Code : codigoAleatorio }
    } catch (error) {
        if( error.code )
            return { errorCrearVis : `Hay un Error de tipo : ${error.code}` }
        return { errorCrearVis : 'Ocurrio un error al registrar al Visitante' }
    }
}

exports.agregarParentesco = async ( IdPac , IdVis ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.AgregarParentesco , [ IdPac , IdVis ] )
        conn.end()
        return { IdPar : result.insertId }
    } catch (error) {
        if( error.code )
            return { errorParentesco : `Hay un Error de tipo : ${error.code}` }
        return { errorParentesco : 'Ocurrio un error al registrar al Parentesco del V/P' }
    }
}

exports.VerificarParentescoES = async ( IdPac , IdPar ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.VerificarParentescoES , [ IdPac , IdPar ] )
        conn.end()
        if( result.length != 1 )
            throw 'Los datos del código QR no estan registrados'
        return { IdVis : result[0].IdVis }
    } catch (error) {
        if( error.code )
            return { errorVerificarVis : `Hay un Error de tipo : ${error.code}` }
        return { errorVerificarVis : error }
    }
}

exports.VerificarCodigoVisitante = async ( IdVis , Code ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.VerificarCodigoVisitante , [ IdVis , Code ] )
        conn.end()
        if( result.length != 1 )
            throw 'El codigo QR ya expiro'
        return { Id : result[0].IdVis }
    } catch (error) {
        if( error.code )
            return { errorVerificarCodigo : `Hay un Error de tipo : ${error.code}` }
        return { errorVerificarCodigo : error }
    }
}

exports.ObtenerDatosVisitante = async ( IdVis ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.ObtenerDatosVisitante , [ IdVis ] )
        conn.end()
        return { Nombre : result[0].Nombre + " " + result[0].Apellido1 + " " + result[0].Apellido2 }
    } catch (error) {
        if( error.code )
            return { errorDatosVis : `Hay un Error de tipo : ${error.code}` }
        return { errorDatosVis : error }
    }
}

exports.VerificarAsistencia = async ( IdPac ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.VerificarVisita , [ IdPac , fechaActual() ] )
        conn.end()
        if( result.length > 0 )
            throw 'Al paciente que deceas visitar, ya lo han visitado anteriormente en este dia'
        return {}
    } catch (error) {
        if( error.code )
            return { errorVerificarAsistencia : `Hay un Error de tipo : ${error.code}` }
        return { errorVerificarAsistencia : error }
    }
}

exports.RegistrarAsistencia = async ( IdPar ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.RegistrarAsistencia , 
            [ horaActual() , fechaActual() , IdPar ] )
        conn.end()
        return { IdAsis : result.insertId }
    } catch (error) {
        if( error.code )
            return { errorRegistrarAsistencia : `Hay un Error de tipo : ${error.code} al Registrar la Asistencia` }
        return { errorRegistrarAsistencia : 'No se logro registrar la asistencia' }
    }
}

exports.ObtenerIdAsistencia = async ( IdPar ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.ObtenerIdAsistencia , [ IdPar , fechaActual() ] )
        conn.end()
        if( result.length != 1 )
            throw 'El visitante no registro su entrada'
        return { IdAsis : result[0].IdAsis }
    } catch (error) {
        if( error.code )
            return { errorIdAsistencia : `Hay un Error de tipo : ${error.code} al Registrar la Salida` }
        return { errorIdAsistencia : error }
    }
}

exports.VerificarValorFechaSalida = async ( IdAsis ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.VerificarValorFechaSalida , [ IdAsis ] )
        conn.end()
        if( result[0].Salida != null )
            throw 'Ya se habia registrado la salida con anterioridad'
        return {}
    } catch (error) {
        if( error.code )
            return { errorValorFecha : `Hay un Error de tipo : ${error.code} al verificar la salida` }
        return { errorValorFecha : error }
    }
}

exports.RegistrarSalida = async ( IdAsis ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.RegistrarSalida , [ horaActual() , IdAsis ] )
        conn.end()
        if( result.affectedRows != 1 )
            throw 'No se logro registrar la salida'
        return {}
    } catch (error) {
        if( error.code )
            return { errorRegistrarSalida : `Hay un Error de tipo : ${error.code} al registrar la salida` }
        return { errorRegistrarSalida : error }
    }
}

exports.ObtenerDatosPaciente = async ( IdPac ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.ObtenerDatosPaciente , [ IdPac ] )
        conn.end()
        if( result.length != 1 )
            throw 'No se tiene registro del paciente'
        return { 
            NombrePac : result[0].Nombre + " " + result[0].Apellido1 + " " + result[0].Apellido2 ,
            NSS : result[0].NSS
        }
    } catch (error) {
        if( error.code )
            return { errorDatPac : `Hay un Error de tipo : ${error.code}` }
        return { errorDatPac : error }
    }
}

exports.VerificarPacienteFecha = async ( NSS , Fecha ) => {
    try {
        let conn = await getConnectionUsuarios()
        let result = await conn.query( sqlUsuario.VerificarPacienteFecha , [ NSS , Fecha ] )
        conn.end()
        if( result.length != 1 )
            throw 'La fecha de Nacimiento no es correcto'
        return { IdPac : result[0].IdPac }
    } catch (error) {
        if( error.code )
            return { errorVerPac : `Hay un Error de tipo : ${error.code}` }
        return { errorVerPac : error }
    }
}

function GenerarCodigo(){
    var result, i, j;
    result = '';
    for (j = 0; j < 5; j++) {
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
}

function fechaActual(){
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
}

function horaActual(){
    let date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}
