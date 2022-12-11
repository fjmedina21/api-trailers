const { Router } = require('express')
const { check } = require('express-validator')

const {
   validateFields,
   isSuper,
   validateJWT} = require('../middlewares')

const {
   emailExist,
   userExist } = require('../helpers')

const {
   usersGet,
   userGetById,
   userPost,
   userPut,
   userDelete } = require('../controllers')

const router = Router()

router.get('/', usersGet)

router.get('/:id',
   [
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

router.put('/:id',
   [
      validateJWT,
      check('id', 'Invalid ID').isMongoId(),
      check('id').custom(userExist),
      validateFields
   ], userPut)

router.delete('/:id',
   [
      validateJWT,
      isSuper,
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(userExist),
      validateFields
   ], userDelete)


module.exports = router