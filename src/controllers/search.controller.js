const { response } = require('express')
const { ObjectId } = require('mongoose').Types

const { Movie } = require('../models')

const collectionsAllowed = ['movies']

const searchMovies = async (term = '', res = response) => {

   const isMongoID = ObjectId.isValid(term)

   if (isMongoID) {
      const movie = await Movie.findById(term)

      return res.status(200).json({
         results: (movie)
            ? [movie]
            : []
      })

   } else if (!isMongoID) {
      const regex = new RegExp(term, 'i')
      const filter = { $and: [{ $or: [{ title: regex }, { directors: regex }, { cast: regex }] }, { state: true }] }

      const movies = await Movie.find(filter)
      const total = await Movie.countDocuments(filter)

      return res.status(200).json({
         total,
         results: movies
      })
   }

}

const search = (req, res = response) => {

   const { collection, term } = req.params

   const msg = `This search haven't been implemented yet`

   if (!collectionsAllowed.includes(collection)) return res.status(400).json({ msg })


   switch (collection) {
      case 'movies':
         searchMovies(term, res)
         break

      default:
         return res.status(501).json({ msg })
   }

}


module.exports = {
   search
}
