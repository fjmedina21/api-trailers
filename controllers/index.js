const auth = require('./auth.controller')
const user = require('./user.controller')
const movie = require('./movie.controller')
const search = require('./search.controller')




module.exports = {
   ...auth,
   ...user,
   ...movie,
   ...search
}