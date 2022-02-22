const { express } = require('../../dependencias')
const route = express.Router();
const Funciones = require('../funciones')

// Rutas para el paciente
route.get( '/Paciente' , Funciones.autentificarAccesoPaginas , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'General/Paciente'  , { Nombre , secciones } )
})

// Rutas para el visitante
route.get( '/Visitante' , Funciones.autentificarAccesoPaginas , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'General/Visitante'  , { Nombre , secciones } )
})

// Rutas para la entrada
route.get( '/Entrada' , Funciones.autentificarAccesoPaginas , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'General/Entrada'  , { Nombre , secciones } )
})

// Rutas para el salida
route.get( '/Salida' , Funciones.autentificarAccesoPaginas , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'General/Salida'  , { Nombre , secciones } )
})

// Rutas para el registro de pacientes y visitantes 
route.get( '/Registro' , Funciones.autentificarAccesoPaginas , (req,res) => {
    let Nombre = req.datosUsuario.Nombre
    let secciones = req.datosUsuario.secciones
    res.render( 'General/RegistrarUsuarios'  , { Nombre , secciones } )
})

module.exports = route