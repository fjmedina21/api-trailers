const { Schema, model } = require('mongoose')


const movieSchema = Schema({
   title: {
      type: String,
      required: [true, "title required"]
   },
   year: {
      type: Number,
      required: [true, "year requiered"]
   },
   directors: String,
   cast: String,
   rating: Number,
   img: {
      public_id: String,
      imgURL: String
   },
   movie_link: {
      type: String,
      required: true
   },
   state: {
      type: Boolean,
      default: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
})

movieSchema.methods.toJSON = function () {
   const { __v, pass, _id, ...movie } = this.toObject()
   movie.uid = _id
   return movie
}

module.exports = model('Movie', movieSchema)