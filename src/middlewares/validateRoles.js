const { request, response } = require('express')


const isADMIN = (req, res = response, next) => {

   if (!req.user) {
      return res.status(500).json({
         msg: 'Verify token before role'
      })
   }

   const { role } = req.user

   if (role !== 'ADMIN') {
      return res.status(500).json({
         msg: `$This action is reserved for ADMIN users`
      })
   }

   next()
}

const isSuper = (req, res = response, next) => {

   if (!req.user) {
      return res.status(500).json({
         msg: 'Verify token before role'
      })
   }

   const { role } = req.user

   if (role !== 'SUPER') {
      return res.status(500).json({
         msg: `This action is reserved for SUPER users`
      })
   }

   next()
}

const rolesAllowed = (roles) => {

   return (req, res = response, next) => {

      if (!req.user) {
         return res.status(500).json({
            msg: 'Verify token before role'
         })
      }

      const { role } = req.user

      if (!roles.includes(role)) {
         return res.status(401).json({
            msg: `This action is reserved to these roles: [${roles}]`
         })
      }

      next()
   }
}

module.exports = {
   isADMIN,
   isSuper,
   rolesAllowed
}