const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const { User } = require('../models')


const validateJWT = async (req = request, res = response, next) => {

   const token = req.header('x-token')

   if (!token) {
      return res.status(401).json({
         mgs: 'token required'
      })
   }

   try {
      const { uid } = jwt.verify(token, process.env.JWTPRIVATEKEY)

      //Read user that match with the uid
      const user = await User.findById(uid)

      if (!user) {
         return res.status(401).json({
            msg: 'user not found'
         })
      }

      //verify user.state
      if (!user.state) {
         return res.status(401).json({
            msg: 'User must exist to perfome this action  '
         })
      }

      req.user = user
      next()

   } catch (error) {
      console.log(error)
      res.status(401).json({
         msg: 'Invalid token'
      })

   }
}


module.exports = {
   validateJWT
}