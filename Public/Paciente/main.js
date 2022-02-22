// Eventos
const socket = io()

socket.on('connect', () => {
    socket.emit('solocitarSalasAnteriores')
})

socket.on('obtenerSalasAnteriores', (SalasAnteriores) => {
    for (let sala of SalasAnteriores) {
        pintarNuevaSala(sala)
    }
})

socket.on('agregarNuevaSala', (nuevaSala) => {
    pintarNuevaSala(nuevaSala)
})

socket.on( 'respuestaServidorEntrada' , ( data ) => {
    if( data.error ){
        Swal.fire({ icon: 'error', title: data.msg, showConfirmButton: false, timer: 5000 })
    }else{
        Swal.fire({ icon: 'success', title: `En breve se iniciara la videollamada`, 
        showConfirmButton: false , timer: 2000 })
            .then(() => {
                let datosSala = document.getElementById('datosSala')
                datosSala.action = '../' + data.url
                datosSala.elements[0].value = data.url
                datosSala.submit()
            })
    }
})

socket.on( 'borrarSala' , (NSS) => {
    let sala = document.getElementById('Sala' + NSS)
    sala.innerText = ''
    contenedor.removeChild(sala)
})

let contenedor = document.getElementById('contenedor')

// Funciones
function pintarNuevaSala(data) {
    let sala = document.createElement('div')
    sala.id = 'Sala' + data.NSS
    sala.classList = 'col-12 col-sm-6 col-lg-4'
    sala.innerHTML = `
    <div class="bg-white shadow-sm p-3 rounded m-1">
        <div class="row"> <div class="col"> <h6> Nombre del Visitante: </h6> <p> ${data.Visitante} </p> </div> </div>
        <div class="row"> <div class="col"> <h6> Nombre del Paciente: </h6> <p> ${data.Paciente} </p> </div> </div>
        <div class="row">
            <div class="col"> <button class="btn btn-success mb-1" id="btn_entrar_${data.NSS}">Entrar</button> </div>
            <div class="col "> <button class="btn btn-danger" id="btn_rechazar_${data.NSS}">Rechazar</button> </div>
        </div>
    </div>
    `
    contenedor.appendChild(sala)
    document.getElementById(`btn_entrar_${data.NSS}`).onclick = function () {
        entrarSala(data.NSS, data.url)
    }
    document.getElementById(`btn_rechazar_${data.NSS}`).onclick = function () {
        colgarSala(data.NSS)
    }
}

function entrarSala(NSS, url) {
    Swal.fire({
        title: 'Coloca tu fecha de Nacimiento',
        icon: 'info',
        html: `
            <input type="date" class="form-control" id="Nacimiento">
        `,
        showCancelButton: true,
        confirmButtonText: 'Entrar'
    }).then( result => {
        if( result.isConfirmed )
            socket.emit('EntrarSalaFecha' , document.getElementById('Nacimiento').value , NSS , url )
    })
}

function colgarSala(NSS) {
    console.log("Corgar " + NSS);
}