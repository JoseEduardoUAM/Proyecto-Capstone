import { alert } from '/Alertas/main.js'
import * as Id from './identificadores.js';


export function boton_consultar(){
    if( verificarDatosVerificador() ){
        alert(`Se debe colocar la matricula del trabajador`, 'warning')
    }else{
        let Matricula = Id.Verificador[0].value
        consultarTrabajador( { Matricula } )
    }
}

export function boton_modificar(){
    obtenerDatosTrabajador()
}

export function boton_eliminar(){
    let Nombre = Id.DatosTrabajador[0].value
    Swal.fire({
        icon: 'warning',
        title: `Estas seguro que deceas eliminar al trabajador ${Nombre}`,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
      }).then( result => {
        if (result.isConfirmed)
            eliminarTrabajador()
      })
}

function eliminarTrabajador(){
    fetch( '/EliminarTrabajador' , { method: 'POST' , body : JSON.stringify( {IdTra} ) , headers: {'Content-Type': 'application/json'} } )
    .then( res => res.json() )
    .then( res => {
        if( res.response ){
            Swal.fire({icon:'success',title:'El trabajador a sido eliminado',showConfirmButton:false,timer:2000})
            limpiarFormularios()
            ocultarModificador()
        }else{
            alert(`Por el momento no se puedo eliminar al trabajador`, 'warning')
        }
    })
    .catch( error => {
        console.log( error );
        alert(`Ocurrio un error al eliminar al trabajador`, 'danger')
    })
}

export function boton_cancelar(){
    ocultarModificador()
    limpiarFormularios()
}

function verificarDatosVerificador() {
    if( Id.Verificador[0].value == "" )
        return true
    return false
}

function consultarTrabajador(data){
    fetch( '/ConsultarTrabajador' , { method: 'POST' , body : JSON.stringify( data ) , headers: {'Content-Type': 'application/json'} } )
    .then( res => res.json() )
    .then( res => {
        if( !res.error ){
            Id.Verificador[0].value = ""
            agregarDatos( res )
            ocultarVerificador()
        }else{
            alert(`${res.error}`, 'warning')
        }
    })
    .catch( error => {
        alert(`Ocurrio un error al consultar al trabajador`, 'danger')
    })
}

function ocultarVerificador(){
    Id.ContenedorVerificador.style.display = 'none'
    Id.ContenedorModificador.style.display = null
}

function ocultarModificador(){
    Id.ContenedorVerificador.style.display = null
    Id.ContenedorModificador.style.display = 'none'
}

let IdTra = null;

function agregarDatos( data ){
    for( let key in data.trabajador ){
        let element = document.getElementById(`${key}`)
        if( element )
            element.value = data.trabajador[key]
    }
    data.secciones.forEach( obj => {
        let element = document.getElementById(`${obj.Nombre}`)
        if( element )
            element.checked = true
    })
    Id.Administrador[0].checked = data.administrador
    IdTra = data.trabajador.IdTra
}

function limpiarFormularios(){
    for( let i = 0 ; i < Id.DatosTrabajador.length ; i++ ){
        Id.DatosTrabajador[i].value = ""
    }
    for( let i = 0 ; i < Id.Secciones.length ; i++ ){
        Id.Secciones[i].checked = false
    }
    Id.Administrador[0].checked = false
    IdTra = null
}

export function activarInputPassword( event ){
    if( event.target.checked )
        Id.Password[1].disabled = false
    else
        Id.Password[1].disabled = true
}

function obtenerDatosTrabajador(){
    let { incompleto , campo } = verificarDatosTrabajador()
    if( incompleto )
        return alert(`Falto agregar datos en el campo ${campo}`, 'warning')
    let trabajador = obtenerDatosFormularioTrabajador()
    trabajador[ "IdTra" ] = IdTra
    let secciones = obtenerSecciones()
    let administrador = obtenerAdministrador()
    if( Id.Password[0].checked ){
        let { incompleto , campo } = verificarPassword()
        if( incompleto )
            return alert(`Falto agregar datos en el campo ${campo}`, 'warning')
        let Password = obtenerPassword()
        trabajador[ "Password" ] = Password
        modificarDatos( {nuevoPassword : true , trabajador , secciones , administrador } )
    }else{
        modificarDatos( {nuevoPassword : false , trabajador , secciones , administrador } )
    }
}

function verificarDatosTrabajador(){
    for( let i = 0 ; i < Id.DatosTrabajador.length ; i++ ){
        if( Id.DatosTrabajador[i].value == "" )
            return { "incompleto" : true , "campo" : Id.DatosTrabajador[i].id }
    }
    return { "incompleto" : false }
}

function verificarPassword() {
    if( Id.Password[1].value == "" )
        return { "incompleto" : true , "campo" : Id.Password[1].id }
    return { "incompleto" : false }
}

function obtenerDatosFormularioTrabajador(){
    let data = {}
    for( let i = 0 ; i < Id.DatosTrabajador.length ; i++ ){
        data[ Id.DatosTrabajador[i].id ] = Id.DatosTrabajador[i].value
    }
    return data
}

function obtenerPassword() {
    return Id.Password[1].value
}

function obtenerSecciones() {
    let data = []
    for( let i = 0 ; i < Id.Secciones.length ; i++ ){
        if( Id.Secciones[i].checked )
            data.push( Id.Secciones[i].value )
    }
    return data
}

function obtenerAdministrador(){
    if( Id.Administrador[0].checked )
        return true
    return false
}

function modificarDatos( data ){
    fetch( '/ModificarTrabajador' , { method: 'POST' , body : JSON.stringify( data ) , headers: {'Content-Type': 'application/json'} } )
    .then( res => res.json() )
    .then( res => {
        if( !res.error ){
            alert(`Se modifico el trabajador`, 'success')
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