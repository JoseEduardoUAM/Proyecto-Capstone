const path = require('path')
const qr = require('../QR/InicioQR');

exports.CrearPDF = async function( doc , Visitantes , Paciente ){
    for( let i = 0 ; i < Visitantes.length ; i++ ){
        if( i % 2 == 0 ){
            doc.addPage()
            await crearSeccionVisitante( Visitantes[i] , Paciente , 0 , doc )
            if( i == 0 )
                await crearSeccionPaciente( Paciente , doc )
        }else{
            await crearSeccionVisitante( Visitantes[i] , Paciente , 320 , doc )
        }
    }
}

async function crearSeccionVisitante( visitante , paciente , offset , doc ){
    // Seccion logos
    doc.fillOpacity(0.4).image( path.join( __dirname , "Imagenes" , "uam.png" ) , 50, 5 + offset, {width: 140})
    doc.fillOpacity(0.4).image( path.join( __dirname , "Imagenes" , "cbi.png" ) , 230, 5 + offset, {width: 140})
    doc.fillOpacity(0.4).image( path.join( __dirname , "Imagenes" , "iot.png" ) , 430, 5 + offset, {width: 140})
    doc.fillOpacity(1);

    // Divisor de secciones
    doc.lineCap('butt').lineWidth(2).moveTo(40, 60 + offset ).lineTo(580, 60 + offset ).fillAndStroke("#2A5CA1", "#2A5CA1")
    doc.lineCap('butt').lineWidth(2).moveTo(40, 100 + offset ).lineTo(580, 100 + offset ).fillAndStroke("#2A5CA1", "#2A5CA1")

    // Titulos
    doc.fontSize(20)
    doc.font('Times-Roman').fillColor('#2A5CA1').text('Sistema de Control de Acceso y Videoconferencia', 100, 75 + offset )
    doc.fontSize(15)
    doc.font('Times-Roman').fillColor('#2A5CA1').text('Datos del Visitante', 50 , 120 + offset )
    doc.font('Times-Roman').fillColor('#2A5CA1').text('Datos del Paciente', 50 , 200 + offset )

    // Primera Tabla
    doc.lineJoin('round').rect( 50, 140 + offset, 250, 20).fill("#D5DCE4")
    doc.rect( 50, 140 + offset , 250, 40).stroke('#B9CDE3')

    // Segunda Tabla
    doc.lineJoin('round').rect( 50, 220 + offset, 250, 20).fill("#D5DCE4")
    doc.rect( 50, 220 + offset , 250, 40).stroke('#B9CDE3')

    // Datos Visitantes
    doc.fontSize(10);
    doc.fillColor('#000000').text( `Nombre(s): ${visitante.Nombre}` , 55 , 145 + offset )
    doc.fillColor('#000000').text( `Apellidos: ${visitante.Apellido1} ${visitante.Apellido2}` , 55 , 165 + offset )

    // Datos Paciente
    doc.fillColor('#000000').text( `Nombre(s): ${paciente.Nombre}` , 55 , 225 + offset )
    doc.fillColor('#000000').text( `Apellidos: ${paciente.Apellido1} ${paciente.Apellido2}` , 55 , 245 + offset)

    // Codigo QR
    let codigoQR = await qr.GenerarCodigoQR( { ids : [ paciente.Id , visitante.IdPar , visitante.Code ] } )
    doc.image( codigoQR , 400, 105 + offset , {width: 120})

    // Aviso de privacidad
    let aviso = `Este código QR solo puede utilizarlo el visitante ${visitante.Nombre}, es necesario mostrar este código QR en los dispositivos del hospital para poder visitar al paciente`
    doc.fillColor('#000000').text(aviso, 315 , 230 + offset , { width: 280,align: 'justify'})

    doc.lineCap('butt').lineWidth(3).moveTo(40, 310 + offset ).lineTo(580, 310 + offset ).dash(20, {space: 10}).stroke('#333333')
}

async function crearSeccionPaciente( paciente , doc ){
       // Codigo QR
       let codigoQR = await qr.GenerarCodigoQR( { IdPac : paciente.Id } )
       doc.image( codigoQR , 140, 640 , {width: 130} )
       doc.fontSize(12);
       doc.fillColor('#000000').text( `Nombre: ${paciente.Nombre} ${paciente.Apellido1} ${paciente.Apellido2}` , 280 , 670 )
       doc.fillColor('#000000').text( `NSS: ${paciente.NSS}` , 280 , 690 )
}