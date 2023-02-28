const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const fs = require('fs-extra')

const { User } = require('../models')

const {
   imgUpload,
   imgUpdate,
   imgDelete
} = require('../helpers')

const usersGet = async (req, res = response) => {
   const { from = 0, limit = 5 } = req.query
   const query = { state: true }

   const [totalUsers, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).sort({ createdAt: -1 })
         .skip(Number(from))
         .limit(Number(limit))
   ])

   return res.status(200).json({
      totalUsers,
      users
   })
}

const userGetById = async (req, res = response) => {
   const { id } = req.params
   const user = await User.findById(id)

   return res.json({
      user
   })
}

const userPost = async (req, res = response) => {
   const { pass, ...schema } = req.body
   const imgFile = req.files?.img

   try {

      if (imgFile) {
         const result = await imgUpload(imgFile, schema)
         if (result) throw result
      }

      //Encriptar la contraseña
      const salt = bcryptjs.genSaltSync()
      schema.pass = bcryptjs.hashSync(pass, salt)

      const user = new User(schema)
      await user.save()

      return res.status(201).json({
         user
      })

   } catch (error) {

      return res.status(400).json(error)

   } finally {
      if (imgFile) await fs.unlink(imgFile.tempFilePath)
   }

}

const userPatch = async (req, res = response) => {
   const { id } = req.params
   const { pass, ...schema } = req.body
   const imgFile = req.files?.img

   try {
      const { state, img } = await User.findById(id)

      if (!state || req.body.state) {

         return res.status(403).json({
            msg: "action not allowed"
         })

      } else if (state) {

         if (pass) {
            const salt = bcryptjs.genSaltSync()
            schema.pass = bcryptjs.hashSync(pass, salt)
         }

         if (imgFile) {
            const result = await imgUpdate(imgFile, img, schema)
            if (result) throw result
         }

         const user = await User.findByIdAndUpdate(id, schema, { new: true })

         return res.status(201).json({
            user
         })
      }

   } catch (error) {

      return res.status(400).json(error)

   } finally {
      if (imgFile) await fs.unlink(imgFile.tempFilePath)
   }

}

const userDelete = async (req = request, res = response) => {
   const { id } = req.params
   const { img } = await User.findById(id)
   const { public_id } = img

   if (public_id) await imgDelete(public_id)

   //Case 1: property state set false, doing the record no longer accesible but it's keep in MongoDB
   //await User.findByIdAndUpdate(id, {state:false, img:{}})

   //case 2: document deleted permanently from MongoDB
   await User.findByIdAndDelete(id)

   return res.status(204)
}


module.exports = {
   usersGet,
   userGetById,
   userPost,
   userPatch,
   userDelete
}
