var CryptoJS = require("crypto-js")
const { Salas } = require('../dependencias')
const { server } = require('../ServerStatic/main')
const ConsultasUsuario = require('../BaseDatos/Usuarios/ConsultasUsuario')
const SocketIO = require('socket.io')

const io = SocketIO(server)

let NumeroPersonas = process.env.NUM_PERSONAS

io.on('connection' , (socket) => {

    socket.on( 'solocitarNumeroPersonas' , () => {
        socket.emit( "recibirNumeroPersonas" , { numeroPersonas : NumeroPersonas } )
    })

    socket.on( 'RegistrarEntrada' , async ( data ) => {
        let { ids } = JSON.parse( decodificarCode(data.codeSecret) )
        try {
            // Se verifica que el codigo QR cuente con los datos requeridos para la consulta
            if( !ids )
                throw 'Codigo QR No valido'
            // Se verifica que el codigo QR tenga parentesco con el paciente 
            let {IdVis,errorConVisES} = await ConsultasUsuario.VerificarParentescoES( ids[0] , ids[1] )
            if( errorConVisES )
                throw errorConVisES
            if( !IdVis )
                throw 'El codigo QR es invalido'
            // Se verifica que el codigo QR cuente con el codigo activo del visitante
            let { Id , errorVerificarCodigo } = await ConsultasUsuario.VerificarCodigoVisitante( IdVis , ids[2] )
            if( errorVerificarCodigo )
                throw errorVerificarCodigo
            if( !Id )
                throw 'El codigo QR es invalido'
            // Se verifica que en este dia no se alla visitado antes al paciente
            let { errorVerificarAsistencia } = await ConsultasUsuario.VerificarAsistencia( ids[0] )
            if ( errorVerificarAsistencia )
                throw errorVerificarAsistencia
            // Registrar la asistencia del visitante
            let { IdAsis , errorRegistrarAsistencia } = await ConsultasUsuario.RegistrarAsistencia( ids[1] )
            if( errorRegistrarAsistencia )
                throw errorRegistrarAsistencia
            if( !IdAsis )
                throw 'No se logro registrar la asistencia, intentelo de nuevo'
            // Se obtiene el nombre del Visitante
            let { Nombre } = await ConsultasUsuario.ObtenerDatosVisitante( IdVis )

            socket.emit( 'respuestaVerificarQREntrada' , { error : false , msg : Nombre } )
            --NumeroPersonas
            io.sockets.emit( 'actualizarNumeroPersonas' , { numeroPersonas : NumeroPersonas } )
        } catch (error) {
            socket.emit( 'respuestaVerificarQREntrada' , { error : true , msg : error } )
        }
    })

    socket.on( 'RegistrarSalida' , async ( data ) => {
        let { ids } = JSON.parse( decodificarCode(data.codeSecret) )
        try {
            // Se verifica que el codifo QR contenga los datos necesario
            if( !ids )
                throw 'Codigo QR No valido'
            // Se verifica que el codigo QR tenga parentesco con el paciente 
            let {IdVis,errorConVisES} = await ConsultasUsuario.VerificarParentescoES( ids[0] , ids[1] )
            if( errorConVisES )
                throw errorConVisES
            if( !IdVis )
                throw 'El codigo QR es invalido'
            // Se verifica que se halla registrado en la entrada
            let { IdAsis , errorIdAsistencia } = await ConsultasUsuario.ObtenerIdAsistencia( ids[1] )
            if( errorIdAsistencia )
                throw errorIdAsistencia
            if( !IdAsis )
                throw 'Ocurrio un problema al registrar la salida, intente de nuevo'
            // Se verifica que no se halla registrado la salida anteriormente
            let { errorValorFecha } = await ConsultasUsuario.VerificarValorFechaSalida( IdAsis )
            if( errorValorFecha )
                throw errorValorFecha
            // Se registra la salida
            let { errorRegistrarSalida } = await ConsultasUsuario.RegistrarSalida( IdAsis )
            if( errorRegistrarSalida )
                throw errorRegistrarSalida
            // Se obtiene el nombre del Visitante
            let { Nombre } = await ConsultasUsuario.ObtenerDatosVisitante( IdVis )
            socket.emit( 'respuestaRegistraSalida' , { error : false , msg : Nombre } )
            ++NumeroPersonas
            io.sockets.emit( 'actualizarNumeroPersonas' , { numeroPersonas : NumeroPersonas } )
        } catch (error) {
            socket.emit( 'respuestaRegistraSalida' , { error : true , msg : error } )
        }
    })

    socket.on( 'CrearSala' , async ( data ) => {
        let { ids } = JSON.parse( decodificarCode(data.codeSecret) )
        try {
            // Se verifica que el codigo QR cuente con los datos requeridos para la consulta
            if( !ids )
                throw 'Codigo QR No valido'
            // Se verifica que el codigo QR tenga parentesco con el paciente 
            let {IdVis,errorConVisES} = await ConsultasUsuario.VerificarParentescoES( ids[0] , ids[1] )
            if( errorConVisES )
                throw errorConVisES
            if( !IdVis )
                throw 'El codigo QR es invalido'
            // Se obtiene el nombre del Visitante
            let { Nombre } = await ConsultasUsuario.ObtenerDatosVisitante( IdVis )
            let { NombrePac , NSS , errorDatPac } = await ConsultasUsuario.ObtenerDatosPaciente( ids[0] )
            if( errorDatPac )
                throw errorDatPac
            let Paciente = NombrePac
            let Visitante = Nombre
            let url = generarURL()
            let sala = { Paciente , NSS , Visitante , url }
            Salas.push( sala )
            socket.emit( 'respuestaServidor' , { error : false , url } )
            io.sockets.emit( 'agregarNuevaSala' , sala )
        } catch (error) {
            socket.emit( 'respuestaServidor' , { error : true , msg : error } )
        }
    })

    socket.on( 'solocitarSalasAnteriores' , () => {
        socket.emit( 'obtenerSalasAnteriores' , Salas )
    })

    socket.on( 'EntrarSalaFecha' , async ( Fecha , NSS , url ) => {
        try {
            let usuarios = io.sockets.adapter.rooms.get(url)
            let numUsuarios = usuarios ? usuarios.size : 0
            if( numUsuarios >= 2 )
                socket.emit( 'respuestaServidorEntrada' , { error : true , msg : 'La sala ya esta llena' } )
            let { IdPac , errorVerPac } = await ConsultasUsuario.VerificarPacienteFecha( NSS , Fecha )
            if( errorVerPac )
                throw errorVerPac
            if( !IdPac )
                throw 'La sala o la Fecha de nacimiento son incorrectos'
            socket.emit( 'respuestaServidorEntrada' , { error : false , url : url } )
        } catch (error) {
            socket.emit( 'respuestaServidorEntrada' , { error : true , msg : error } )
        }
    })

	/****************Eventos para la Sala*******************************/
	// Variable que indica si esta en la sala de videoconferencia
	let indicadorSala = false;
	// Variable que indica en que sala se encuentra
	let sala = null;
	//Evento que permite unir al [ Paciente | Familiar ] a sala mediante la url y si existen 2 clientes conectados emite su id
	socket.on( 'unirseSala' , (url,indicador) => {
		indicadorSala = indicador;
		sala = url;
		socket.join(url);
		let usuarios = io.sockets.adapter.rooms.get(url);
	      usuarios.forEach(( x ) => {
	          if( x != socket.id ){
	              socket.emit('other-users',x);
	          }
	      });
	});
	// Enviar oferta para iniciar la conexión
    socket.on('offer', (socketId, description) => {
      socket.to(socketId).emit('offer', socket.id, description);
    })
    // Enviar respuesta de solicitud de oferta
    socket.on('answer', (socketId, description) => {
      socket.to(socketId).emit('answer', description);
    })
    // Enviar señales para establecer el canal de comunicación
    socket.on('candidate', (socketId, candidate) => {
      socket.to(socketId).emit('candidate', candidate);
    })
	// Evento que se inicia al entrar a la pagina y solicita las salas anteriores
	socket.on( 'disconnect' , () => {
		if( indicadorSala & io.sockets.adapter.rooms.get(sala) == undefined){
		 	let NSS , num
            for( let i = 0 ; i < Salas.length ; i++ ){
                if( Salas[i].url == sala ){
                    NSS = Salas[i].NSS
                    num = i
                    break
                }
            }
            Salas.splice( num , 1 )
		 	io.sockets.emit('borrarSala' , NSS )
		}
	})

})

function decodificarCode( data ){
    let bytes = CryptoJS.AES.decrypt(data, process.env.KEY_SECRET_SERVER )
    let originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
}

function decodificarCode( data ){
    let bytes = CryptoJS.AES.decrypt(data, process.env.KEY_SECRET_SERVER )
    let originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
}

function generarURL() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
}