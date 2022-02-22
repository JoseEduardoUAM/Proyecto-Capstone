const { express } = require('../../dependencias')
const ConsultasTrabajador = require('../../BaseDatos/Trabajador/ConsultasTrabajador')
const Funciones = require('../funciones')

const route = express.Router()

route.post('/RegistrarTrabajador' , Funciones.autentificarPeticionesAdministrativo , async (req,res) => {
    try {
        let { errorCrearTrabajador , IdTra} = await ConsultasTrabajador.crearTrabajador( req.body.datos )
        if( errorCrearTrabajador )
            throw errorCrearTrabajador
        let { errorSeccionTrabajador } = await ConsultasTrabajador.agregarSeccionesTrabajador( IdTra , req.body.secciones )
        if( errorSeccionTrabajador )
            throw errorSeccionTrabajador
        if( req.body.administrador ){
            let { errorPermisoAdm } = await ConsultasTrabajador.agregarPermisoAdministrador( IdTra )
            if( errorPermisoAdm )
                throw errorPermisoAdm
        }
        res.json( {} )
    } catch (error) {
        res.json( { error } )
    }
})

route.post('/ConsultarTrabajador' , Funciones.autentificarPeticionesAdministrativo , async (req,res) => {
    try {
        let { errorInfTra , trabajador } = await ConsultasTrabajador.ObtenerInformacionTrabajador( req.body.Matricula )
        if( errorInfTra )
            throw errorInfTra
        let { errorVPT , secciones} = await ConsultasTrabajador.verificarPaginasTrabajador( trabajador.IdTra )
        if( errorVPT )
            throw errorVPT
        let { errorAdm , administrador } = await ConsultasTrabajador.verificarAdministrador( trabajador.IdTra )
        if( errorAdm )
            throw errorAdm
        return res.json( { trabajador , secciones , administrador } )
    } catch (error) {
        res.json( {error} )
    }
})

route.post('/EliminarTrabajador' , Funciones.autentificarPeticionesAdministrativo , async (req,res) => {
    let IdTra = req.body.IdTra;
    try {
        let errorSecciones = await ConsultasTrabajador.eliminarSecciones( IdTra )
        if( errorSecciones )
            throw "Error al intentar eliminar las secciones del trabajador"
        let errorAdministrador = await ConsultasTrabajador.eliminarPermisoAdministrador( IdTra )
        if( errorAdministrador )
            throw "Error al intentar quitar de administrador al trabajador"
        let errorTrabajador = await ConsultasTrabajador.eliminarTrabajador( IdTra )
        if( errorTrabajador )
            throw "Error al intentar eliminar al trabajador"
        res.json( { "response" : true } )
    } catch (error) {
        console.error( error );
        res.json( { "response" : false } )
    }
})

route.post('/ModificarTrabajador' , Funciones.autentificarPeticionesAdministrativo , async (req,res) => {
    let { trabajador , secciones , administrador , nuevoPassword } = req.body
    try {
        // En esta seccion se eliminan los datos anteriores (secciones y permisos de administrador)
        let errorSecciones = await ConsultasTrabajador.eliminarSecciones( trabajador.IdTra )
        if( errorSecciones )
            throw "Error al intentar modificar las secciones anteriores del trabajador"
        let errorAdministrador = await ConsultasTrabajador.eliminarPermisoAdministrador( trabajador.IdTra )
            if( errorAdministrador )
                throw "Error al intentar modificar los permisos anteriores de administrador del trabajador"   
        // En esta seccion se agregan los nuevos datos (secciones y permisos de administrador)
        let { errorSeccionTrabajador } = await ConsultasTrabajador.agregarSeccionesTrabajador( trabajador.IdTra , secciones )
        if( errorSeccionTrabajador )
            throw errorSeccionTrabajador
        if( administrador ){
            let { errorPermisoAdm } = await ConsultasTrabajador.agregarPermisoAdministrador( trabajador.IdTra )
            if( errorPermisoAdm )
                throw errorPermisoAdm
        }
        // En esta seccion se modifica los datos del trabajador
        if( !nuevoPassword ){
            let { errorDatTra } = await ConsultasTrabajador.ModificarDatosTrabajador( trabajador )
            if( errorDatTra )
                throw errorDatTra
        }else{
            let { errorTodoTra } = await ConsultasTrabajador.ModificarTodoTrabajador( trabajador )
            if( errorTodoTra )
                throw errorTodoTra
        }
        return res.json( {} )
    } catch (error) {
        res.json( {error} )
    }
})

module.exports = route