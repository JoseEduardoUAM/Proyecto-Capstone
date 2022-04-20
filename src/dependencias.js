module.exports.express = require('express')
module.exports.cookieParser = require('cookie-parser')
module.exports.path = require('path')
module.exports.jwt = require('jsonwebtoken')
module.exports.mariadb = require('mariadb')
module.exports.fs = require('fs')

if( process.env.NODE_ENV === 'desarrollo' )
    require('dotenv').config()

exports.Salas = []