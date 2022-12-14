const jwt = require('jsonwebtoken')


const generateJWT = (uid = '', role = '') => {



   return new Promise((resolve, reject) => {

      const payload = { uid }

      jwt.sign(payload, process.env.JWTPRIVATEKEY, { expiresIn: '8h' }, (err, token) => {

         if (err) {

            reject(err)

         } else {
            resolve(token)
         }

      })

   })
}


module.exports = {
   generateJWT
}