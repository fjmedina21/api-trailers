const { request, response } = require('express')
const fs = require('fs-extra')

const { Movie } = require('../models')
const { imgUpload, imgUpdate }=require('../helpers')

const trailersGet = async (req, res = response) => {
   const { from = 0, limit = 25 } = req.query
   const query = { state: true }

   const [totalTrailers, trailers] = await Promise.all([
      Movie.countDocuments(query),
      Movie.find(query)
         .skip(Number(from))
         .limit(Number(limit))
   ])

   res.json({
      totalTrailers,
      trailers
   })
}

const trailerGetById = async (req, res = response) => {
   const { id } = req.params
   const trailer = await Movie.findById(id)
   res.json(trailer)
}

const trailerPost = async (req, res = response) => {
   const schema = req.body

   try {
      const trailer = new Movie(schema)

      if (req.files?.img) {
         const { tempFilePath } = req.files.img
         const { public_id, secure_url } = await imgUpload(tempFilePath)

         trailer.img = {
            public_id ,
            imgURL: secure_url
         }

         await fs.unlink(tempFilePath)
      }

      await trailer.save()
      res.json(trailer)

   } catch (error) {

      if (req.files?.img) {
         await fs.unlink(tempFilePath)
      }

      res.status(400).json({
         msg: error.message
      })
   }
}

const trailerPut = async (req, res = response) => {
   const { id } = req.params
   const { ...schema } = req.body
   const newIMGPath = req.files.img.tempFilePath

   try {
      const { state, img } = await Movie.findById(id)
      const dbPublicId = img.public_id


      if (!state) {
         res.status(406).json({ "error": "action not allowed" })
      } else if (state) {

         const { public_id, secure_url } = (dbPublicId)
         ? await imgUpdate(dbPublicId, newIMGPath)
         : await imgUpload(newIMGPath)

         schema.img = {
            public_id,
            imgURL: secure_url
         }

         const trailer = await Movie.findByIdAndUpdate(id, schema, {new:true})

         await fs.unlink(newIMGPath)
         res.json(trailer)

      }
   } catch (error) {

      if (req.files?.img) {
         await fs.unlink(newIMGPath)
      }
      res.status(400).json({
         msg: error.message
      })

   }
}

const trailerDelete = async (req = request, res = response) => {
   const { id } = req.params
   const trailer = await Movie.findByIdAndUpdate(id, { state: false }, { new: true })
   res.json(trailer)
}


module.exports = {
   trailersGet,
   trailerGetById,
   trailerPost,
   trailerPut,
   trailerDelete
}