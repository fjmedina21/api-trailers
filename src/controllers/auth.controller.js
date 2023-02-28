const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const { User } = require('../models')
const { generateJWT } = require('../helpers')

const login = async (req = request, res = response) => {

   const { email, pass } = req.body

   try {

      //verify user.email
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(400).json({
            msg: "Invalid credentials."
         })
      }

      //verify user.state
      if (!user.state) {
         return res.status(400).json({
            msg: "Sorry, we can't find an account with this email address. Please try again or create a new account."
         })
      }

      //verify user.pass
      const password = bcryptjs.compareSync(pass, user.pass)
      if (!password) {
         return res.status(400).json({
            msg: "Invalid credentials."
         })
      }

      //generate JWT
      const token = await generateJWT(user.id, user.role)

      return res.status(200).json({
         user,
         token
      })

   } catch (error) {

      return res.status(500).json(error)

   }

}


module.exports = {
   login
}
