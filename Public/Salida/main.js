import QrScanner from "/qr-scanner/qr-scanner.min.js"
//import { io } from "/socket.io/client-dist/socket.io.esm.min.js"

// Identificadores
const video = document.getElementById('qr-video')
const camList = document.getElementById('cam-list')
const numeroPersonas = document.getElementById('NumeroPersonas')

// Iniciar QR Scanner
const scanner = new QrScanner( video, result => {
    enviarCodigoQR( result.data )
},{ highlightScanRegion: true, highlightCodeOutline: true})

scanner.start().then(() => { QrScanner.listCameras(true).then( agregarCamaras ) })

camList.addEventListener('change', event => { scanner.setCamera(event.target.value) })

window.scanner = scanner

// Eventos
const socket = io()

socket.on( 'connect' , () => {
	socket.emit( 'solocitarNumeroPersonas' )
})

socket.on( 'recibirNumeroPersonas' , ( data ) => {
    numeroPersonas.innerText = `${data.numeroPersonas} personas`
})

socket.on( 'respuestaRegistraSalida' , ( data ) => {
    if( data.error ){
        Swal.fire({ icon: 'error', title: data.msg, showConfirmButton: false, timer: 5000 })
            .then(() => {
                scanner.start()
            })
    }else{
        Swal.fire({ icon: 'success', title: `Adios ${data.msg}`, showConfirmButton: false, timer: 2000 })
            .then(() => {
                scanner.start()
            })
    }
})

socket.on( 'actualizarNumeroPersonas' , ( data ) => {
    numeroPersonas.innerText = `${data.numeroPersonas} personas`
})

// Funciones para los sockett IO
function enviarCodigoQR( data ){
    let qrCode = JSON.parse( data )
    if( qrCode.codeSecret ){
        scanner.stop()
        socket.emit( 'RegistrarSalida' , qrCode )
    }
}

// Funciones para el QR Scanner
function agregarCamaras( cameras ){
    cameras.forEach(camera => {
        const option = document.createElement('option')
        option.value = camera.id
        option.text = camera.label
        camList.add(option)
    })
}