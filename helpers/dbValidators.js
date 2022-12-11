const { Role, User, Movie } = require('../models')


const validRole = async (role = '') => {

   // Verificar si el role existe
   const roleExist = await Role.findOne({ role })

   if (!roleExist) {
      throw new Error(`${role} is an invalid role`)
   }

}

const emailExist = async (email = '') => {

   // Verificar si el correo existe
   const emailExist = await User.findOne({ email })

   if (emailExist) {
      throw new Error(`This email:${email} already exist`)
   }

}

const userExist = async (id) => {

   // Verificar si el id existe
   const userExist = await User.findById(id)

   if (!userExist) {
      throw new Error(`This user id:${id} do not exist`)
   }

}

const trailerExist = async (id) => {

   // Verificar si el id existe
   const trailerExist = await Movie.findById(id)

   if (!trailerExist) {
      throw new Error(`This trailer id:${id} do not exist`)
   }
}

const allowedCollections = (collection = '', collections = []) => {

   const included = collections.includes(collection)
   if (!included) {
      throw new Error(`The collection ${collection} is not allowed - valid collections: ${collections}`)
   }

   return true

}

module.exports = {
   allowedCollections,
   emailExist,
   userExist,
   trailerExist,
   validRole
}