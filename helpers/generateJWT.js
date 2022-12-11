const jwt = require('jsonwebtoken')


const generateJWT = (uid = '', role = '') => {

   return new Promise((resolve, reject) => {

      const payload = { uid, role }

      jwt.sign(payload, process.env.JWTPRIVATEKEY, {
         expiresIn: '4h'
      }, (err, token) => {

         if (err) {

            reject('Token not generated')

         } else {
            resolve(token)
         }

      })

   })
}


module.exports = {
   generateJWT
}