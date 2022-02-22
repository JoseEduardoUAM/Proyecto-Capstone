const qrcode = require('qrcode')
var CryptoJS = require("crypto-js")

exports.GenerarCodigoQR = async function( data ){
    var ciphertext = CryptoJS.AES.encrypt( JSON.stringify( data ) , process.env.KEY_SECRET_SERVER ).toString()
    let code = JSON.stringify( { codeSecret : ciphertext } )
    let QR = await qrcode.toDataURL(code)
    return QR
}
