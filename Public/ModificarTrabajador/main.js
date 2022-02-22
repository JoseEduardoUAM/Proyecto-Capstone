import * as Id from './identificadores.js'
import * as Funcion from './funcion.js'

Id.btn_consultar.addEventListener( 'click' , Funcion.boton_consultar )
Id.btn_modificar.addEventListener( 'click' , Funcion.boton_modificar )
Id.btn_eliminar.addEventListener( 'click' , Funcion.boton_eliminar )
Id.btn_cancelar.addEventListener( 'click' , Funcion.boton_cancelar )

Id.Password[0].addEventListener( 'change' , Funcion.activarInputPassword )
