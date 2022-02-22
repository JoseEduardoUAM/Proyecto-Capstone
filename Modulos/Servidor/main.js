//Módulo local Dep.js
const { express , https , path } = require('../Dependencias');
// Módulo local Direcciones
const funcion = require('./funciones');
// Datos para el servidor
const { certificado , puerto } = require('../Datos');

// Se inicializa la herramienta express
const app = express();

///Documentos estaticos
app.use('/Principal', express.static( path.join( process.cwd() , 'Public' , 'Principal' ) ));

//Middleware que analiza archivos urlencoded y JSON en solicitudes post
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/json" }));

// Pagina Registro
app.use('/ArchivosRegistro', express.static( path.join( process.cwd() , 'Public' , 'Registro' ) ));
app.post( '/Registro' , funcion.mostrarRegistro );

// Archivos estaticos para el Scanner QR
app.use('/ModuloScannerQR', express.static( path.join( process.cwd() , 'node_modules' , 'qr-scanner' ) ));

// Pagina Entrada
app.use('/ArchivosEntrada', express.static( path.join( process.cwd() , 'Public' , 'Entrada' ) ));
app.post('/Entrada', funcion.mostrarEntrada);

// Pagina Salida
app.use('/ArchivosSalida', express.static( path.join( process.cwd() , 'Public' , 'Salida' ) ));
app.post('/Salida', funcion.mostrarSalida);

// Pagina para el Visitante
app.use('/ArchivosVisitante', express.static( path.join( process.cwd() , 'Public' , 'Visitante' ) ));
app.post('/Visitante', funcion.mostrarVisitante);

// Pagina para el Paciente
app.use('/ArchivosPaciente', express.static( path.join( process.cwd() , 'Public' , 'Paciente' ) ));
app.post('/Paciente', funcion.mostrarPaciente);

// Respuesta al solicitar acceso a las paginas Registro, Entrada, Salida, Visitante y Paciente
app.post( '/solictarAcessoPaginas' , funcion.permitirAccesoPaginas );
// Creacion de Archivos PDF
app.post('/CrearPDF', funcion.crearPDF);
// Mostrar archivo PDF
app.post('/MostrarPDF', funcion.mostrarPDF);
// Control de Acceso
app.post('/ControlAccesoEntrada', funcion.controlAccesoEntrada);
app.post('/ControlAccesoSalida', funcion.controlAccesoSalida);

// Pagina para la Sala de Videollamada
app.use('/ArchivosSala', express.static( path.join( process.cwd() , 'Public' , 'Sala' ) ));
app.post('/:id', funcion.mostrarSala);

//Configuracion del Servidor https
exports.server = https.createServer( certificado , app ).listen( puerto , () => {
    console.log( `\x1b[33m Servidor corriendo en el puerto ${puerto} \x1b[0m`);
});