const { mariadb } = require('../../dependencias')
const sqlTrabajador = require('./sqlTrabajador')

const poolTrabajadores = mariadb.createPool({
    host : process.env.HOST_BD,
    port : process.env.PORT_BD,
    user : process.env.USER_BD,
    password : process.env.PWD_BD,
    database : process.env.DATABASE_TRABAJADORES
})

async function getConnectionTrabajadores(){
    try {
        let conn = await poolTrabajadores.getConnection()
        return conn
    } catch (error) {
        if( error.code == 'ER_GET_CONNECTION_TIMEOUT' ){
            console.log( '¡Tiempo de espera para la conexion con la BD agotado!' )
        }
    }
}

exports.verificarTrabajador = async ( Matricula , Password ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.ConsultarTrabajador , [ Matricula , Password ] )
        conn.end()
        if( result.length != 1 )
            throw 'El usuario y/o contraseña son incorrectos'
        return { IdTra : result[0].IdTra , Nombre : result[0].Nombre }
    } catch (error) {
        if( error.code )
            return { errorTra : `Hay un Error de tipo : ${error.code}` }
        return { errorTra : error }
    }
}

exports.verificarAdministrador = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.ConsultarAdministrador , [ IdTra ] )
        conn.end();
        if( result.length != 1 )
            return { administrador : false }
        return { administrador : true }
    } catch (error) {
        if( error.code )
            return { errorAdm : `Hay un Error de tipo : ${error.code}` }
        return { errorAdm : 'Ocurrio un error en el servidor al verificar al trabajador' }
    }
}

exports.verificarPaginasTrabajador = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.ConsultarPaginasTrabajador , [ IdTra ] )
        conn.end()
        return { secciones : result }
    } catch (error) {
        if( error.code )
            return { errorVPT : `Hay un Error de tipo : ${error.code}` }
        return { errorVPT : 'Ocurrio un error al verificar las secciones del trabajador' }
    }
}

exports.obtenerAvisos = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.Avisos , [ IdTra ] )
        conn.end()
        return result
    } catch (error) {
        return []
    }
}

exports.crearTrabajador = async ( { Nombre , Apellido1 , Apellido2 , Matricula , Password } ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.CrearTrabajador , 
            [ Nombre , Apellido1 , Apellido2 , Matricula , Password ] )
        conn.end()
        return { IdTra : result.insertId }
    } catch (error) {
        if( error.code )
            return { errorCrearTrabajador : `Hay un Error de tipo : ${error.code}` }
        return { errorCrearTrabajador : 'Ocurrio un error al registrar al trabajador' }
    }
}

exports.agregarSeccionesTrabajador = async ( IdTra , Secciones ) => {
    try {
        let conn = await getConnectionTrabajadores()
        Secciones.forEach( async seccion => {
            await conn.query( sqlTrabajador.AgregarSeccionTrabajador , [ IdTra , seccion ] )
        });
        conn.end()
        return {}
    } catch (error) {
        if( error.code )
            return { errorSeccionTrabajador : `Hay un Error de tipo : ${error.code}` }
        return { errorSeccionTrabajador : 'Ocurrio un error al agregar las secciones, pero, ya se registro al trabajador' }
    }
}

exports.agregarPermisoAdministrador = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        await conn.query( sqlTrabajador.AgregarPermisoAdministrador , [ IdTra ] )
        conn.end()
        return {}
    } catch (error) {
        if( error.code )
            return { errorPermisoAdm : `Hay un Error de tipo : ${error.code}` }
        return { errorPermisoAdm : 'Ocurrio un error al darle permisos de administracion al trabajador, pero, ya se registro al trabajador' }
    }
}

exports.ObtenerInformacionTrabajador = async ( Matricula ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.InformacionTrabajador , [ Matricula ] )
        conn.end()
        if( result.length != 1  )
            throw 'La matricula no esta registrada'
        return { trabajador : result[0] }
    } catch (error) {
        if( error.code )
            return { errorInfTra : `Hay un Error de tipo : ${error.code}` }
        return { errorInfTra : error }
    }
}

exports.eliminarSecciones = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        await conn.query( sqlTrabajador.EliminarSecciones , [ IdTra ] )
        conn.end()
        return false;
    } catch (error) {
        return true;
    }
}

exports.eliminarPermisoAdministrador = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        await conn.query( sqlTrabajador.EliminarPermisoAdministrador , [ IdTra ] )
        conn.end()
        return false;
    } catch (error) {
        return true;
    }
}

exports.eliminarTrabajador = async ( IdTra ) => {
    try {
        let conn = await getConnectionTrabajadores()
        await conn.query( sqlTrabajador.EliminarTrabajador , [ IdTra ] )
        conn.end()
        return false
    } catch (error) {
        return true
    }
}

exports.ModificarDatosTrabajador = async ( { IdTra , Nombre , Apellido1 , Apellido2 , Matricula } ) => {
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.ModificarDatosTrabajador , 
            [ Nombre , Apellido1 , Apellido2 , Matricula , IdTra ] )
        conn.end()
        if( result.affectedRows < 1 )
            throw 'No se logro modificar los datos del trabajador'
        return {}
    } catch (error) {
        if( error.code )
            return { errorDatTra : `Hay un Error de tipo : ${error.code}` }
        return { errorDatTra : error }
    }
}

exports.ModificarTodoTrabajador = async (data) => {
    let { IdTra , Nombre , Apellido1 , Apellido2 , Matricula , Password } = data
    try {
        let conn = await getConnectionTrabajadores()
        let result = await conn.query( sqlTrabajador.ModificarTodoTrabajador , 
            [ Nombre , Apellido1 , Apellido2 , Matricula , Password , IdTra ] )
        conn.end()
        if( result.affectedRows < 1 )
            throw 'No se logro modificar todos los datos del trabajador'
        return {}
    } catch (error) {
        if( error.code )
            return { errorTodoTra : `Hay un Error de tipo : ${error.code}` }
        return { errorTodoTra : error }
    }
}

