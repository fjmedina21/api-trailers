const { request, response } = require('express')
const fs = require('fs-extra')

const { Movie } = require('../models')

const {
   imgUpload,
   imgUpdate,
   imgDelete
} = require('../helpers')

const moviesGet = async (req, res = response) => {
   const { from = 0, limit = 25 } = req.query
   const query = { state: true }

   const [totalMovies, movies] = await Promise.all([
      Movie.countDocuments(query),
      Movie.find(query).sort({ createdAt: -1 })
         .skip(Number(from))
         .limit(Number(limit))
   ])

   return res.json({
      totalMovies,
      movies
   })
}

const movieGetById = async (req, res = response) => {
   const { id } = req.params
   const movie = await Movie.findById(id)

   return res.json({
      movie
   })
}

const moviePost = async (req, res = response) => {
   const schema = req.body
   const imgFile = req.files?.img

   try {

      if (imgFile) {
         const result = await imgUpload(imgFile, schema)
         if (result) throw result
      }

      const movie = new Movie(schema)
      await movie.save()

      return res.json({
         movie
      })

   } catch (error) {

      return res.status(400).json(error)

   } finally {
      if (imgFile) await fs.unlink(imgFile.tempFilePath)
   }

}

const moviePatch = async (req, res = response) => {
   const { id } = req.params
   const schema = req.body
   const imgFile = req.files?.img

   try {
      const { state, img } = await Movie.findById(id)

      if (!state) {

         return res.status(406).json({
            err: "action not allowed"
         })

      } else if (state) {

         if (imgFile) {
            const result = await imgUpdate(imgFile, img, schema)
            if (result) throw result
         }

         const movie = await Movie.findByIdAndUpdate(id, schema, { new: true })

         return res.json({
            movie
         })
      }

   } catch (error) {

      return res.status(400).json(error)

   } finally {
      if (imgFile) await fs.unlink(imgFile.tempFilePath)
   }
}

const movieDelete = async (req = request, res = response) => {
   const { id } = req.params
   const { img } = await Movie.findById(id)
   const { public_id } = img

   if (public_id) await imgDelete(public_id)
   await Movie.findByIdAndDelete(id)

   return res.json({
      msg: "Movie removed"
   })
}


module.exports = {
   moviesGet,
   movieGetById,
   moviePost,
   moviePatch,
   movieDelete
}
