const { request, response } = require('express')
const fs = require('fs-extra')

const { Movie } = require('../models')
const { imgUpload, imgUpdate, imgDelete }=require('../helpers')

const trailersGet = async (req, res = response) => {
   const { from = 0, limit = 25 } = req.query
   const query = { state: true }

   const [totalTrailers, trailers] = await Promise.all([
      Movie.countDocuments(query),
      Movie.find(query).sort({ createdAt: -1 })
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
   const imgFile = req.files?.img

   try {

      if (imgFile) await imgUpload(imgFile, schema)

      const trailer = new Movie(schema)


      await trailer.save()
      res.json(trailer)

   } catch (error) {

      if (imgFile) await fs.unlink(imgFile.tempFilePath)

      res.status(400).json({
         err: error.message
      })
   }
}

const trailerPut = async (req, res = response) => {
   const { id } = req.params
   const { ...schema } = req.body
   const imgFile = req.files?.img

   try {
      const { state, img } = await Movie.findById(id)

      if (!state) {
         res.status(406).json({ err: "action not allowed" })
      } else if (state) {

         if (imgFile) await imgUpdate(imgFile, img, schema)

         const trailer = await Movie.findByIdAndUpdate(id, schema, {new:true})

         res.json(trailer)
      }
   } catch (error) {

      if (imgFile) await fs.unlink(imgFile.tempFilePath)

      res.status(400).json({
         err: error.message
      })

   }
}

const trailerDelete = async (req = request, res = response) => {
   const { id } = req.params
   const { img } = await Movie.findById(id)
   const { public_id } = img

   await imgDelete(public_id)

   const trailer = await Movie.findByIdAndDelete(id)
   res.json(trailer)
}


module.exports = {
   trailersGet,
   trailerGetById,
   trailerPost,
   trailerPut,
   trailerDelete
}
