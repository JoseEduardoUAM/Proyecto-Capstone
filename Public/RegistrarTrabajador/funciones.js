import { alert } from '/Alertas/main.js'
import * as Id from './identificadores.js';

export function boton_registro(){
    let verificador = verificarDatos()
    if( verificador.incompleto ){
        alert(`Falto agregar datos en el campo ${verificador.campo}`, 'warning')
    }else{
        let datos = obtenerDatosTrabajador()
        let secciones = obtenerSecciones()
        let administrador = obtenerAdministrador()
        enviarDatos( { datos , secciones , administrador } )
    }
}

function enviarDatos( data ){
    fetch( '/RegistrarTrabajador' , { method: 'POST' , body : JSON.stringify( data ) , headers: {'Content-Type': 'application/json'} } )
        .then( res => res.json() )
        .then( res => {
            if( !res.error ){
                alert(`Se registro al trabajador`, 'success')
                limpiarFormulario()
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

function verificarDatos(){
    for( let i = 0 ; i < Id.DatosTrabajador.length ; i++ ){
        if( Id.DatosTrabajador[i].value == "" )
            return { "incompleto" : true , "campo" : Id.DatosTrabajador[i].id }
    }
    return { "incompleto" : false }
}

function obtenerDatosTrabajador(){
    let data = {}
    for( let i = 0 ; i < Id.DatosTrabajador.length ; i++ ){
        data[ Id.DatosTrabajador[i].id ] = Id.DatosTrabajador[i].value
    }
    return data
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

function limpiarFormulario(){
    for( let i = 0 ; i < Id.DatosTrabajador.length ; i++ ){
        Id.DatosTrabajador[i].value = ""
    }
    for( let i = 0 ; i < Id.Secciones.length ; i++ ){
        Id.Secciones[i].checked = false
    }
    Id.Administrador[0].checked = false
}