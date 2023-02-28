const { Router } = require('express')
const { check } = require('express-validator')

const { login } = require('../controllers')
const { validateFields } = require('../middlewares')

const router = Router()

router.post('/login',
   [
      check('email', 'Please enter a valid email.').isEmail(),
      check('pass', 'Your password must contain at least 6 characters.').not().isEmpty(),
      validateFields
   ], login
)


module.exports = router