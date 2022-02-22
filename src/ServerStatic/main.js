// Dependencias
const { express , path , cookieParser } = require('../dependencias')

// Utilizando Dependencias
const app = express()

// Agregadondo variables al servidor ExpressJS
app.set( 'port' , process.env.PORT )
app.set( 'view engine' , 'ejs' )

// Agregadon Middleware al servidor ExpressJS
app.use( express.json() )
app.use( express.urlencoded({extended:true}) )
app.use( cookieParser() );

app.use( express.static( path.join( process.cwd() , 'public' ) ) )
app.use( '/sweetalert2/' , express.static( path.join( process.cwd() , "node_modules" , "sweetalert2" , "dist" ) ) )
app.use( '/simple-datatables/' , express.static( path.join( process.cwd() , "node_modules" , "simple-datatables" ) ) )
app.use( '/qr-scanner/' , express.static( path.join( process.cwd() , "node_modules" , "qr-scanner" ) ) )
app.use( '/socket.io/client-dist' , express.static( path.join( process.cwd() , "node_modules" , "socket.io" , "client-dist" ) ) );

// Rutas para las paginas de la aplicacion
app.use( '/' , require('./Login/GET_Main') )
app.use( '/' , require('./General/GET_Paginas') )
app.use( '/' , require('./Administrador/GET_Administrativo') )

// Rutas para las respuestas del servidor
app.use( '/' , require('./Login/POST_Main') )
app.use( '/' , require('./Administrador/POST_Administrador') )
app.use( '/' , require('./General/POST_Paginas') )

exports.server = require('http').createServer( app ).listen( app.get('port') , ()=> {
    console.log( `\x1b[33m Servidor corriendo en el puerto ${app.get('port')} \x1b[0m` )
})