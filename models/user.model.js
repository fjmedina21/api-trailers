const { Schema, model } = require('mongoose')


const userSchema = Schema({
   name: {
      type: String,
      required: [true, "name required"]
   },
   email: {
      type: String,
      required: [true, "email required"],
      unique: true
   },
   pass: {
      type: String,
      required: [true, "password required"]
   },
   img: {
      public_id: String,
      imgURL: String
   },
   role: {
      type: String,
      enum: ['ADMIN', 'SUPER'],
      default: 'ADMIN'
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

userSchema.methods.toJSON = function () {
   const { __v, pass, _id,  state, ...user } = this.toObject()
   user.uid = _id
   return user
}


module.exports = model('User', userSchema)