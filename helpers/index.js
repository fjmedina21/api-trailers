const dbValidators = require('./dbValidators')
const generateJWT = require('./generateJWT')
const fileUpload = require('./fileUpload')







module.exports = {
   ...dbValidators,
   ...generateJWT,
   ...fileUpload
}