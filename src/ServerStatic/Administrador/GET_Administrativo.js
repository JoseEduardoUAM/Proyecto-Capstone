const { express } = require('../../dependencias')
const ConsultasUsuario = require('../../BaseDatos/Usuarios/ConsultasUsuario')
const Funciones = require('../funciones')

const route = express.Router();

/* Paginas para Administrativos del Sistema */
route.get( '/MostrarDatos' , Funciones.autentificarAdministrativo , async (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    let Tabla = await ConsultasUsuario.obtenerRegistrosEntrada()
    res.render( 'Administrador/MostrarDatos' , { Nombre , secciones , Tabla } )
})

route.get( '/ModificarTrabajador' , Funciones.autentificarAdministrativo , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'Administrador/ModificarTrabajador' , { Nombre , secciones } )
})

route.get( '/RegistrarTrabajador' , Funciones.autentificarAdministrativo , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'Administrador/RegistrarTrabajador' , { Nombre , secciones } )
})

module.exports = route