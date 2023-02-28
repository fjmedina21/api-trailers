const mongoose = require('mongoose')
mongoose.set("strictQuery", false)


const dbConnection = async (err, res) => {

   try {

      mongoose.connect(process.env.MONGODB_CNN, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      })


   } catch (error) {

      console.error(error)

   }
}

module.exports = {
   dbConnection
}