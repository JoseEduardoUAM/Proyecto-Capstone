// Modulo local Dependencias.js
const { path, fs } = require('../Dependencias');
// Modulo local Consultas.js
const ConsultasSQL = require('../BD/main');
// Modulo local informacionBD
const { codeServer } = require('../Datos');
// Modulo local GenerarPDF
const { crearArchivoPDF } = require('../PDF/main');

/*****************************************************************************************************/
// Funcion que pemrite mostrar la pagina de Registro
exports.mostrarRegistro = function (req, res) {
    if (req.body.codigo == codeServer) {
        res.sendFile(path.join(process.cwd(), 'Public', 'Registro', 'index.html'));
    } else {
        res.send("acceso denegado");
    }
}
// Funcion que permite mostrar la pagina Entarda
exports.mostrarEntrada = function (req, res) {
    if (req.body.codigo == codeServer) {
        res.sendFile(path.join(process.cwd(), 'Public', 'Entrada', 'index.html'));
    } else {
        res.send("acceso denegado");
    }
}
// Funcion que permite mostrar la pagina Salida
exports.mostrarSalida = function (req, res) {
    if (req.body.codigo == codeServer) {
        res.sendFile(path.join(process.cwd(), 'Public', 'Salida', 'index.html'));
    } else {
        res.send("acceso denegado");
    }
}
// Funcion para mostrar la pagina del Visitante
exports.mostrarVisitante = function (req, res) {
    if (req.body.codigo == codeServer) {
        res.sendFile(path.join(process.cwd(), 'Public', 'Visitante', 'index.html'));
    } else {
        res.send("acceso denegado");
    }
}
// Funcion para mostrar la pagina de la sala de videollamada
exports.mostrarPaciente = function (req, res) {
    if (req.body.codigo == codeServer) {
        res.sendFile(path.join(process.cwd(), 'Public', 'Paciente', 'index.html'));
    } else {
        res.send("acceso denegado");
    }
}
// Funcion para mostrar la pagina de la sala de videollamada
exports.mostrarSala = function (req, res) {
    let html = fs.readFileSync( path.join( process.cwd() , "Public" , "Sala" , "index.html" ) , 'utf8');
    Object.keys( req.body ).forEach( x => {
        html = html.replace( `{{${x}}}` , req.body[x] );
        html = html.replace( `{{${x}}}` , req.body[x] );
    })
    res.send(html);
}
/*****************************************************************************************************/
// Funcion que permite indicar si se tiene acceso a las paginas Registro, Entrada, Salida, Visitante y Paciente
const paginas = [ '../Registro' , '../Entrada' , '../Salida' , '../Visitante' , '../Paciente' ];
exports.permitirAccesoPaginas = async function (req, res) {
    try {
        let { acceso, seccion } = await ConsultasSQL.obtenerAcceso(req.body);
        if (acceso) {
            res.end(JSON.stringify({ acceso: true, url: paginas[seccion-1] , codigo: codeServer }));
        } else {
            res.end(JSON.stringify({ acceso: false }));
        }
    } catch (error) {
        res.end(JSON.stringify({ acceso: false }));
    }
}
// Numero de visitantes dentro del hopital
let numeroVisitantes = 3;
// Funcion que permite indicar el control de acceso de Entrada
exports.controlAccesoEntrada = async function( req , res ){
    try {
        let consulta = await ConsultasSQL.consultarUsuario(req.body.id);
        if (consulta.length > 0) {
            let entrada = await ConsultasSQL.consultarEntrada(req.body.id);
            if (entrada.length <= 0) {
                if( numeroVisitantes > 0 ){
                    let { insercion } = await ConsultasSQL.almacenarEntrada(req.body.id);
                    --numeroVisitantes;
                    res.send( JSON.stringify({ acceso: true, data: consulta[0]}) );
                    return;
                }
                res.send( JSON.stringify({ acceso: false, data: 'Espere por favor, el hispital ya esta lleno' }) );
                return;
            }
            res.send(JSON.stringify({ acceso : false , data : 'El usuario ya tiene un ingreso este dia' }));
            return;
        }
        res.send(JSON.stringify({ acceso : false , data : 'El usuario o QR mostrado no esta registrado' }));
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ acceso: false , data : "Ocurrio un error en el servidor, espere por favor" }));
    }
}
// Funcion que permite indicar el control de acceso de Entrada
exports.controlAccesoSalida = async function( req , res ){
    try {
        let consulta = await ConsultasSQL.consultarUsuario(req.body.id);
        if (consulta.length > 0) {
            let salida = await ConsultasSQL.consultarSalida(req.body.id);
            if (salida.length == 1) {
                let { insercion } = await ConsultasSQL.almacenarSalida(req.body.id);
                ++numeroVisitantes;
                res.send( JSON.stringify({ acceso: true, data: consulta[0] }) );
                return;
            }
            res.send(JSON.stringify({ acceso: false , data : "El usuario no registro su entrada o ya habia registrado su salida" }));
            return;
        }
        res.send(JSON.stringify({ acceso : false , data : 'El usuario mostrado no esta registrado' }));
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ acceso: false , data : "Ocurrio un error en el servidor, espere por favor" }));
    }
}
// Funcion que permite crear un archivo PDF
exports.crearPDF = async function (req, res) {
    let datos = req.body;
    try {
        let { insercion, id } = await ConsultasSQL.almacenarUsuario(datos);
        if (insercion) {
            crearArchivoPDF( datos , { id: id, codigo: codeServer } , () => {
                var data = fs.readFileSync( path.join( process.cwd() , 'Documentos_PDF' , `${datos.nss}.pdf` ), 'base64');
                res.send(JSON.stringify( { existencia: true , archivo : data}) );
            });
        } else {
            res.send(JSON.stringify({ existencia: false }));
        }
    } catch (error) {
        console.log(error);
        res.send(JSON.stringify({ existencia: false }));
    }
}
// Funcion que permite mostrar un archivo PDF
exports.mostrarPDF = function (req, res) {
    let direccion = path.join( process.cwd(), 'Documentos_PDF', `${req.body.nombrePDF}.pdf` );
    if ( fs.existsSync(direccion) ) {
        var data = fs.readFileSync(direccion, 'base64');
        res.send(JSON.stringify({ existencia: true, archivo: data }));
    } else {
        res.send(JSON.stringify({ existencia: false }));
    }
}

/*****************************************************************************************************/