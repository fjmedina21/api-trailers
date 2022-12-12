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
   trailer_link: {
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
   const { __v, pass, _id, ...trailer } = this.toObject()
   trailer.uid = _id
   return trailer
}

module.exports = model('Movie', movieSchema)