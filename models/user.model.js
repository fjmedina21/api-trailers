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
      type: String,
      required: false
   },
   role: {
      type: String,
      enum: ['ADMIN', 'SUPER'],
      default: 'ADMIN'
   },
   state: {
      type: Boolean,
      default: true
   }
})

userSchema.methods.toJSON = function () {
   const { __v, pass, _id, ...user } = this.toObject()
   user.uid = _id
   return user
}


module.exports = model('User', userSchema)