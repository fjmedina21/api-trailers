const { Role, User, Movie } = require('../models')


const validRole = async (role = '') => {

   // Verificar si el rol existe
   const roleExist = await Role.findOne({ role })

   if (!roleExist) {
      throw new Error(` This role:${role.toUpperCase()} doesn't exist`)
   }

}

const emailExist = async (email = '') => {

   // Verificar si el correo existe
   const emailExist = await User.findOne({ email })

   if (emailExist) {
      throw new Error(`Someone already has this email address. Try another one.`)
   }

}

const userIdExist = async (id) => {

   // Verificar si el id existe
   const userExist = await User.findById(id)

   if (!userExist) {
      throw new Error(`This user id doesn't exist`)
   }

}

const movieRegistered = async (title = '') => {

   // Verificar si el correo existe
   const movieRegistered = await Movie.findOne({ title })

   if (movieRegistered) {
      throw new Error(`This movie is already registered`)
   }

}

const movieIdExist = async (id) => {

   // Verificar si el id existe
   const movieExist = await Movie.findById(id)

   if (!movieExist) {
      throw new Error(`This movie id is not registered`)
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
   userIdExist,
   movieIdExist,
   movieRegistered,
   validRole
}
