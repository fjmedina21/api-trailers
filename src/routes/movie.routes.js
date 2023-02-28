const { Router } = require('express')
const { check } = require('express-validator')

const {
   validateFields,
   rolesAllowed,
   validateJWT,
} = require('../middlewares')

const {
   movieIdExist,
   movieRegistered
} = require('../helpers')

const {
   moviesGet,
   movieGetById,
   moviePost,
   movieDelete,
   moviePatch
} = require('../controllers')

const router = Router()
const roles = ['ADMIN', 'SUPER']


router.get('/', moviesGet)

router.get('/:id',
   [
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(movieIdExist),
      validateFields
   ], movieGetById)

router.post('/',
   [
      validateJWT,
      rolesAllowed(roles),
      check('title', 'Title required').not().isEmpty(),
      check('year', 'Year requiered').not().isEmpty(),
      check('movie_link', 'Movie link requiered').not().isEmpty(),
      check('title').custom(movieRegistered),
      validateFields,
   ], moviePost)

router.patch('/:id',
   [
      validateJWT,
      rolesAllowed(roles),
      check('id', 'Invalid ID').isMongoId(),
      check('id').custom(movieIdExist),
      validateFields,
   ], moviePatch)

router.delete('/:id',
   [
      validateJWT,
      rolesAllowed(roles),
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(movieIdExist),
      validateFields
   ], movieDelete)



module.exports = router