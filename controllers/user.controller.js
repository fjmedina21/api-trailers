const { request, response } = require('express')
const bcryptjs = require('bcryptjs')

const { User } = require('../models')

const usersGet = async (req, res = response) => {
   const { from = 0, limit = 5 } = req.query
   const query = { state: true }

   const [totalUsers, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
         .skip(Number(from))
         .limit(Number(limit))
   ])

   res.json({
      totalUsers,
      users
   })
}

const userGetById = async (req, res = response) => {
   const { id } = req.params
   const user = await User.findById(id)
   res.json({user})
}

const userPost = async (req, res = response) => {
   const schema = req.body
   const user = new User(schema)

   //Encriptar la contraseña
   const salt = bcryptjs.genSaltSync()
   user.pass = bcryptjs.hashSync(pass, salt)

   try {

      await user.save()
      res.json(user)

   } catch (error) {

      res.status(400).json({
         err:error.message
      })

   }

}

const userPut = async (req, res = response) => {
   const { id } = req.params
   const { pass, ...schema } = req.body

   const user = await User.findById(id)
   const userState = user.state

   if (!userState) {
      res.status(406).json({ msg: "action not allowed" })

   } else if (userState) {

      if (pass) {
         const salt = bcryptjs.genSaltSync()
         schema.pass = bcryptjs.hashSync(pass, salt)
      }

      const user = await User.findByIdAndUpdate(id, schema, { new: true })

      res.json(user)
   }
}

const userDelete = async (req = request, res = response) => {
   const { id } = req.params
   const user = await User.findByIdAndUpdate(id, { state: false }, { new: true })
   res.json(user)
}


module.exports = {
   usersGet,
   userGetById,
   userPost,
   userPut,
   userDelete
}
