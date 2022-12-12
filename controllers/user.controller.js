const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const fs = require('fs-extra')

const { User } = require('../models')
const { imgUpload, imgUpdate, imgDelete } = require('../helpers')

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
   const imgFile = req.files?.img

   try {

      if (imgFile) await imgUpload(imgFile, schema)

      //Encriptar la contraseña
      const salt = bcryptjs.genSaltSync()
      schema.pass = bcryptjs.hashSync(schema.pass, salt)


      const user = new User(schema)

      await user.save()
      res.json(user)

   } catch (error) {

      if (imgFile) await fs.unlink(imgFile.tempFilePath)

      res.status(400).json({
         err:error.message
      })

   }

}

const userPut = async (req, res = response) => {
   const { id } = req.params
   const { pass, ...schema } = req.body
   const imgFile = req.files?.img

   try {
      const { state, img } = await User.findById(id)

      if (!state) {
         res.status(406).json({ msg: "action not allowed" })

      } else if (state) {

         if (pass) {

            const salt = bcryptjs.genSaltSync()
            schema.pass = bcryptjs.hashSync(pass, salt)

         }

         if (imgFile) await imgUpdate(imgFile, img, schema)

         const user = await User.findByIdAndUpdate(id, schema, { new: true })

         res.json(user)
      }
   } catch (error) {

      if (imgFile) await fs.unlink(imgFile.tempFilePath)

      res.status(400).json({
         error
      })
   }

}

const userDelete = async (req = request, res = response) => {
   const { id } = req.params
   const { img } = await User.findById(id)
   const { public_id } = img

   await imgDelete(public_id)

   const user = await User.findByIdAndDelete(id)
   res.json(user)
}


module.exports = {
   usersGet,
   userGetById,
   userPost,
   userPut,
   userDelete
}
