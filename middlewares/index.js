const validateFields = require('./validateFields')
const validateRoles = require('./validateRoles')
const validateJWT = require('./validateJWT')





module.exports = {
   ...validateFields,
   ...validateRoles,
   ...validateJWT
}