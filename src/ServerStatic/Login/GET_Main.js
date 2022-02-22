const { express } = require('../../dependencias')
const Funciones = require('../funciones')
const ConsultasTrabajador = require('../../BaseDatos/Trabajador/ConsultasTrabajador')
const route = express.Router()

route.get( '/login' , Funciones.negarNuevoRegistro , (req,res) => {
    res.render('Login/Login')
})

route.get( '/cerraSesion' , (req,res) => {
    res.clearCookie('jwt')
    res.redirect('/login')
})

route.get( '/' , Funciones.autentificarInicio ,async  (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    let administrador = req.datosUsuario.administrador
    let Fecha = Funciones.generarFecha()
    if( administrador )
        return res.render( 'Administrador/InicioAdministrador' , { Nombre , secciones , Fecha } )
    let Avisos = await ConsultasTrabajador.obtenerAvisos( req.datosUsuario.IdTra )
    res.render( 'Administrador/InicioGeneral' , { Nombre , secciones , Avisos , Fecha} )
})

module.exports = route