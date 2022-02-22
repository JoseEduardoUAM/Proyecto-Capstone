const { express , jwt } = require('../../dependencias')
const ConsultasTrabajador = require('../../BaseDatos/Trabajador/ConsultasTrabajador')

const route = express.Router();

route.post( '/login' , async (req,res) => {
    // Obtener Datos del Cliente
    let Matricula = req.body.Matricula;
    let Password = req.body.Password;
    try {
        // Se verifica si el cliente coloco los datos solicitados
        if( Matricula == "" || Password == "" )
            throw 'Se debe colocar la matricula y la contraseña'
        // Se verifica si el trabajador esta registrado
        let { errorTra , IdTra , Nombre } = await ConsultasTrabajador.verificarTrabajador( Matricula , Password )
        if( errorTra )
            throw errorTra
        // Se verifica si el trabajador es administrador
        let { errorAdm , administrador } = await ConsultasTrabajador.verificarAdministrador( IdTra )
        if( errorAdm )
            throw errorAdm
        // Se obtiene las secciones que administra el trabajador
        let { errorVPT , secciones } = await ConsultasTrabajador.verificarPaginasTrabajador( IdTra )
        if( errorVPT )
            throw errorVPT
        // Se crea el JSON Web Token
        let token = jwt.sign( { Nombre , secciones , administrador , IdTra } , 
            process.env.KEY_SECRET_JWT , { expiresIn: '1h' })
        // Se crea la cookie para el cliente
        const cookieOptions = { expires: new Date( Date.now() + (60 * 60 * 1000) ) , httpOnly: true }
        // Se envia la cookie al cliente
        res.cookie( 'jwt' , token , cookieOptions )
        // Se redirecciona al cliente a la pagina Inicial
        res.render('Login/LoginAviso',{ mensaje : true , alert: true , title: 'Bienvenido' , url: '/' })
    } catch (error) {
        if( error.code )
            return res.render('Login/LoginAviso',{ mensaje : true , alert: false , title: error.code})
        return res.render('Login/LoginAviso',{ mensaje : true , alert: false , title: error})
    }
})

module.exports = route;