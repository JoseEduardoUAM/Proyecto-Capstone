const {fs,path} = require('./Dependencias');

// Datos para la conexion con la BD
exports.conexion = {
    host     : '192.168.3.40',
    user     : 'root',
    password : 'root',
    database : 'hospital'
}

// Codigo para accesar al servidor
exports.codeServer = 'uam';

// Puerto del Servidor
exports.puerto = 3000;

// Certificado SSL
exports.certificado = {
    cert : fs.readFileSync( path.join( __dirname , 'Servidor' , 'CertificadosSSL' , 'cert.pem' ) ),
    key  : fs.readFileSync( path.join( __dirname , 'Servidor' , 'CertificadosSSL' , 'key.pem' ) )
}
