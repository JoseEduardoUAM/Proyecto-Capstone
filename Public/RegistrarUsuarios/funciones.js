import { alert } from '/Alertas/main.js'
import * as Id from './identificadores.js';

let idNuevoVis = 1;

// Funciones para los botones
export function boton_registro(){
    // Se verifican los datos del paciente
    let { incompletoPaciente , campoPaciente } = VerificarFormularioPaciente()
    if( incompletoPaciente ){
        return MostrarAdvertencia( campoPaciente )
    }
    let { incompletoVisitante , campoVisitante } = VerificarFormulariosVisitantes()
    if( incompletoVisitante )
        return MostrarAdvertencia( campoVisitante )
    obtenerDatos()
}

export function btn_cancelar(){
    limpiarFormularios()
}

export function btn_visitante(){
    CrearNuevoFormularioVisitante()
    CrearObjetoVisitante()
}

/////////////////////////////////////////////////////////
function obtenerDatos(){
    // Se obtienen los dats del paciente
    let fp = Id.FormularioPaciente
    let paciente = new Paciente( fp[0].id.value , fp[1].id.value , fp[2].id.value , fp[3].id.value , fp[4].id.value )

    // Se obtienen los datos de los visitantes
    let visitantes = []
    let fv = Id.FormulariosVisitantes
    for( let vis in fv ){
        visitantes.push( new Visitante( fv[vis][0].id.value , fv[vis][1].id.value , fv[vis][2].id.value , fv[vis][3].id.value ) )
    }

    enviarDatos( { paciente , visitantes } )
}

/////////////////////////////////////////////////////////////
function enviarDatos(data){
    fetch( '/RegistrarUsuarios' , { method: 'POST' , body : JSON.stringify( data ) , headers: {'Content-Type': 'application/json'} } )
    .then( res => res.blob() )
    .then( res => {
        if( !res.error ){
            alert(`Se registro correctamenta a los usuarios`, 'success')
            limpiarFormularios()
            var fileURL = URL.createObjectURL(res)
            window.open(fileURL)
        }else{
            alert(`${res.error}`, 'danger')
        }
        window.scrollBy( 0 , - document.body.clientHeight )
    })
    .catch( error => {
        alert(`Ocurrio un error al registrar al trabajador`, 'danger')
        window.scrollBy( 0 , - document.body.clientHeight )
    })
}

function Paciente( Nombre , Apellido1 , Apellido2 , NSS , FechaNacimiento ){
    this.Nombre = Nombre
    this.Apellido1 = Apellido1
    this.Apellido2 = Apellido2
    this.NSS = NSS
    this.FechaNacimiento = FechaNacimiento
}

function Visitante( Nombre , Apellido1 , Apellido2 , CURP ) {
    this.Nombre = Nombre
    this.Apellido1 = Apellido1
    this.Apellido2 = Apellido2
    this.CURP = CURP
}

///////////////////////////////////////////////////////////
function CrearNuevoFormularioVisitante(){
    let contenedor = document.createElement('div')
    contenedor.classList = 'container bg-white p-3 border rounded mb-3'
    contenedor.id = `Visitante${idNuevoVis}`
    contenedor.innerHTML = `
    <div class="row">
        <div class="col"> <h3> Otro Visitante </h3> </div>
    </div>
    <div class="row">
        <div class="col-sm-12 col-lg-4">
            <label for="NombreVisitante${idNuevoVis}" class="form-label">Nombre del Visitante:</label>
            <input type="text" class="form-control" id="NombreVisitante${idNuevoVis}">
        </div>
        <div class="col-sm-12 col-md-6 col-lg-4">
            <label for="Apellido1Visitante${idNuevoVis}" class="form-label">Primer Apellido del Visitante:</label>
            <input type="text" class="form-control" id="Apellido1Visitante${idNuevoVis}">
        </div>
        <div class="col-sm-12 col-md-6 col-lg-4">
            <label for="Apellido2Visitante${idNuevoVis}" class="form-label">Segundo Apellido del Visitante:</label>
            <input type="text" class="form-control" id="Apellido2Visitante${idNuevoVis}">
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-4">
            <label for="CURP${idNuevoVis}" class="form-label">CURP del Visitante:</label>
            <input type="text" class="form-control" id="CURP${idNuevoVis}">
        </div>
        <div class="col-sm-12 col-md-6 col-lg-4 ">
            <button type="button" class="btn btn-danger mt-4" id="${idNuevoVis}">Quitar</button>
        </div>
    </div>
    `
    Id.ContenedorVisitantes.appendChild( contenedor )
    document.getElementById( `${idNuevoVis}` ).addEventListener( 'click' , quitarVisitante )
}

function CrearObjetoVisitante(){
    Id.FormulariosVisitantes[ `${idNuevoVis}` ] = [
        { id : document.getElementById(`NombreVisitante${idNuevoVis}`) , campo : 'Nombre del Otro Visitante' },
        { id : document.getElementById(`Apellido1Visitante${idNuevoVis}`) , campo : 'Primer Apellido del Otro Visitante' },
        { id : document.getElementById(`Apellido2Visitante${idNuevoVis}`) , campo : 'Segundo Apellido del Otro Visitante' },
        { id : document.getElementById(`CURP${idNuevoVis}`) , campo : 'CURP del Otro Visitante' }
    ]
    idNuevoVis++;
}

function quitarVisitante(e){
    let num = e.target.id
    let contenedor = document.getElementById(`Visitante${num}`)
    contenedor.innerText = ''
    delete Id.FormulariosVisitantes[ `${num}` ]
    Id.ContenedorVisitantes.removeChild( contenedor )
}

///////////////////////////////////////////////////////////
function VerificarFormularioPaciente(){
    for( let obj of Id.FormularioPaciente ){
        if( obj.id.value == '' )
            return { incompletoPaciente : true , campoPaciente : obj.campo }
    }
    return { incompletoPaciente : false }
}

function VerificarFormulariosVisitantes(){
    for( let key in Id.FormulariosVisitantes ){
        for( let obj of Id.FormulariosVisitantes[key] ){
            if( obj.id.value == '' )
                return { incompletoVisitante : true , campoVisitante : obj.campo }
        }
    }
    return { incompletoVisitante : false }
}

function MostrarAdvertencia( msg ){
    alert(`Falto agregar datos en el campo ${msg}`, 'warning')
    window.scrollBy( 0 , - document.body.clientHeight )
}

function limpiarFormularios(){
    for( let obj of Id.FormularioPaciente ){
        obj.id.value = ''
    }
    for( let key in Id.FormulariosVisitantes ){
        if( key == 'principal' ){
            for( let obj of Id.FormulariosVisitantes[key] ){
                obj.id.value = ''
            }
        }else{
            let contenedor = document.getElementById(`Visitante${key}`)
            contenedor.innerText = ''
            delete Id.FormulariosVisitantes[ `${key}` ]
            Id.ContenedorVisitantes.removeChild( contenedor )
        }
    }
}