const { Router } = require('express')
const { check } = require('express-validator')

const { login } = require('../controllers')
const { validateFields } = require('../middlewares')

const router = Router()

router.post('/login',
   [
      check('email', 'email required').isEmail(),
      check('pass', 'password required').not().isEmpty(),
      validateFields
   ], login
)


module.exports = router