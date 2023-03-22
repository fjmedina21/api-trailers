const path = require('path');

const express = require('express')
const helmet = require('helmet');
const cors = require('cors')
const fileupload = require('express-fileupload');

require('dotenv').config()

const { dbConnection } = require('../database/config.db.js')

class Server {

   constructor() {

      this.app = express()
      this.port = process.env.PORT || 3000

      this.paths = {
         auth: '/auth',
         user: '/user',
         movie: '/movie',
         search: '/search',

      }

      //Conectar DB
      this.connectDB()

      //Middlewares
      this.middlewares()

      //App routes
      this.routes()

   }

   async connectDB() {
      await dbConnection()
   }

   middlewares() {

      //CORS
      this.app.use(cors())

      this.app.use(helmet())

      //Parseo y lectura del body
      this.app.use(express.json())

      //Carga de archivo
      this.app.use(fileupload({
         useTempFiles: true,
         tempFileDir: './tmp'
      }))

      //Public Directory
      this.app.use(express.static(path.join(__dirname,'../Public')))
   }

   routes() {
      this.app.use(this.paths.auth, require('../routes/auth.routes'))
      this.app.use(this.paths.user, require('../routes/user.routes'))
      this.app.use(this.paths.movie, require('../routes/movie.routes'))
      this.app.use(this.paths.search, require('../routes/search.routes'))

   }

   listen() {
      this.app.listen(this.port, (req, res) => {
         console.log(`listening at http://localhost:${this.port}`)
      })
   }
}


module.exports = Server