const { Router } = require('express')
const { check } = require('express-validator')

const roles = ['ADMIN', 'SUPER']

const {
   validateFields,
   isSuper,
   validateJWT,
   rolesAllowed
} = require('../middlewares')

const {
   emailExist,
   userExist
} = require('../helpers')

const {
   usersGet,
   userGetById,
   userPost,
   userDelete,
   userPatch
} = require('../controllers')

const router = Router()

router.get('/', validateJWT, usersGet)

router.get('/:id',
   [
      validateJWT,
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(userExist),
      validateFields
   ], userGetById)

router.post('/',
   [
      validateJWT,
      isSuper,
      check('name', 'name required').not().isEmpty(),
      check('pass', 'Password must be greater than 6 letters').isLength({ min: 6 }),
      check('email', 'Invalid email').isEmail(),
      check('email').custom(emailExist),
      validateFields
   ], userPost)

router.patch('/:id',
   [
      validateJWT,
      check('id', 'Invalid ID').isMongoId(),
      check('id').custom(userExist),
      validateFields
   ], userPatch)

router.delete('/:id',
   [
      validateJWT,
      isSuper,
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(userExist),
      validateFields
   ], userDelete)


   
module.exports = router