const { Schema, model } = require('mongoose')


const roleSchema = new Schema({
   role: {
      type: String,
      required: [true, 'role required']
   }
})


module.exports = model('Role', roleSchema)