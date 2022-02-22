const { express } = require('../../dependencias')
const ConsultasUsuario = require('../../BaseDatos/Usuarios/ConsultasUsuario')
const Funciones = require('../funciones')
const pdfkit = require('pdfkit')
const pdf = require('../../PDF/ArchivoPDF')

const route = express.Router()

route.post('/RegistrarUsuarios' , async (req,res) => {
    let { paciente , visitantes } = req.body
    try {
        // Se crea el Paciente
        let { errorCrearPaciente , datosPaciente } = await ConsultasUsuario.crearPaciente(paciente)
        if( errorCrearPaciente )
            throw errorCrearPaciente
        let datosVisitantes = []
        // Obtener Datos del Visitante, si no existe, se crea
        for( let obj of visitantes ){
            // Se verifica si existe el Visitante
            let { Id , Code1 , errorVerificarVis } = await ConsultasUsuario.verificarVisitante( obj.CURP )
            if( errorVerificarVis )
                throw errorVerificarVis
            if( Id ){
                // Si existe se almacena su Id y el visitante
                obj.Id = Id
                obj.Code = Code1
                datosVisitantes.push( obj )
            }else{
                // Si no existe, se crea y se almacena su Id
                let { IdVis , Code , errorCrearVis } = await ConsultasUsuario.crearVisitante( obj )
                if( errorCrearVis )
                    throw errorCrearVis
                    obj.Id = IdVis
                    obj.Code = Code
                datosVisitantes.push( obj )
            }
        }
        // Relacionar Id del paciente con los Id de los Visitantes
        for( let obj of datosVisitantes ){
            let { errorParentesco , IdPar } = await ConsultasUsuario.agregarParentesco( datosPaciente.Id , obj.Id )
            if( errorParentesco )
                throw errorParentesco
            obj.IdPar = IdPar
        }

        // Para generar el PDF
        const doc = new pdfkit({autoFirstPage: false})

        const stream = res.writeHead( 200 , {
            'Content-Type' : 'application/pdf',
            'Content-disposition': 'attachment;filename=archivo.pdf'
        })

        doc.on( 'data' , (data) => { stream.write(data) } )
        doc.on( 'end' , () => { stream.end() } )
        
        await pdf.CrearPDF( doc , datosVisitantes , datosPaciente )

        doc.end()

    } catch (error) {
        res.json( { error } )
    }
})

route.post( '/:id' , Funciones.verificarSalaVideollamada , (req,res) => {
    let { Paciente , Visitante , url } = req.datos
    if( req.body.tipo == 'Visitante' )
        return res.render( 'Sala/Sala' , 
            { NombreLocal : Visitante , NombreRemoto : Paciente , url , regresar : 'Visitante' } 
        )
    return res.render( 'Sala/Sala' , 
        { NombreLocal : Paciente , NombreRemoto : Visitante , url , regresar : 'Paciente' } 
    )
})

module.exports = route