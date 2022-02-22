const { jwt } = require('../dependencias')
const { Salas } = require('../dependencias');

// Funcion para permitir o denegar acceso a la pagina principal
module.exports.autentificarInicio = ( req , res , next ) => {
    try {
        if( !req.cookies.jwt )
            throw 'El usuario no tiene permiso para visitar esta pagina'
        let decodificada = jwt.verify( req.cookies.jwt , process.env.KEY_SECRET_JWT )
        req.datosUsuario = decodificada
        next()
    } catch (error) {
        return res.redirect('/login');
    }
}

// Funcion para permitir el acceso a una pagina general
module.exports.autentificarAccesoPaginas = ( req , res , next ) => {
    try {
        if( !req.cookies.jwt )
            throw 'El usuario no tiene permiso para visitar esta pagina'
        let decodificada = jwt.verify( req.cookies.jwt , process.env.KEY_SECRET_JWT )
        let { secciones } = decodificada
        let acceso = secciones.find( seccion => req.route.path == `/${seccion.Nombre}` )
        if( !acceso )
            return res.redirect('/')
        req.datosUsuario = decodificada
        next()
    } catch (error) {
        return res.redirect('/login')
    }
}

// Funcion para autenticar a los administrativos
module.exports.autentificarAdministrativo = ( req , res , next ) => {
    try {
        if( !req.cookies.jwt )
            throw 'El usuario no tiene permiso para visitar esta pagina'
        let decodificada = jwt.verify( req.cookies.jwt , process.env.KEY_SECRET_JWT )
        if( !decodificada.administrador )
            throw 'Usted no tiene permiso de administracion para esta URL'
        req.datosUsuario = decodificada
        next()
    } catch (error) {
        res.redirect('/')
    }
}

// Funcion para negar nuevamente el registro
module.exports.negarNuevoRegistro = ( req , res , next ) => {
    try {
        if( req.cookies.jwt )
            return res.redirect('/')
        next()
    } catch (error) {
        res.redirect('/')
    }
}

// Funcion para permitir la comunicacion mediante metodo post
module.exports.autentificarPeticionesAdministrativo = ( req , res , next ) => {
    try {
        if( !req.cookies.jwt )
            throw 'Usted no tiene permiso para utilizar esta URL porque no esta registrado'
        let decodificada = jwt.verify( req.cookies.jwt , process.env.KEY_SECRET_JWT )
        if( !decodificada.administrador )
            throw 'Usted no tiene permiso de administracion para esta URL'
        next()
    } catch (error) {
        return { error }
    }
}

// Funcion para permitir verificar la sala y obtener los datos del paciente y el familiar
module.exports.verificarSalaVideollamada = ( req , res , next ) => {
    let { url } = req.body
    for( let sala of Salas ){
        if( sala.url == url ){
            req.datos = sala
            return next()
        }
    }
    res.redirect('/')
}

let dia = [ 'Domingo' , 'Lunes' , 'Martes' , 'Miercoles' , 'Jueves' , 'Viernes' , 'Sabado' ]
let mes = [ 'Enero' , 'Febrero' , 'Marzo' , 'Abril' , 'Mayo' , 'Junio' , 'Julio' , 'Agosto' , 'Septiembre' , 'Octubre' , 'Noviembre' , 'Diciembre' ]

module.exports.generarFecha = () => {
    let date = new Date();
    return dia[ date.getDay() ] + ' ' + date.getDate() + ' de ' + mes[ date.getMonth() ] + ' del ' + date.getFullYear()
}