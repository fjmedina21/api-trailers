const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const { User } = require('../models')
const { generateJWT } = require('../helpers/generateJWT')

const login = async (req = request, res = response) => {

   const { email, pass } = req.body

   try {

      //verify user.email
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(400).json({
            msg: 'Email not found - email'
         })
      }

      //verify user.state
      if (!user.state) {
         return res.status(400).json({
            msg: 'User not found - state'
         })
      }

      //verify user.pass
      const password = bcryptjs.compareSync(pass, user.pass)
      if (!password) {
         return res.status(400).json({
            msg: 'Incorret password'
         })
      }

      //generate JWT
      const token = await generateJWT(user.id, user.role)

      res.json({
         user,
         token
      })

   } catch (error) {

      res.status(500).json({
         msg: 'Server error'
      })

   }

}


module.exports = {
   login
}