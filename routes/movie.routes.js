const { Router } = require('express')
const { check } = require('express-validator')

const {
   validateFields,
   rolesAllowed,
   validateJWT,
} = require('../middlewares')

const {
   trailerExist
} = require('../helpers')

const {
   trailersGet,
   trailerGetById,
   trailerPost,
   trailerPut,
   trailerDelete } = require('../controllers')

const router = Router()
const roles = ['ADMIN', 'SUPER']


router.get('/', trailersGet)

router.get('/:id',
   [
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(trailerExist),
      validateFields
   ], trailerGetById)

router.post('/',
   [
      validateJWT,
      rolesAllowed(roles),
      check('title', 'Title required').not().isEmpty(),
      check('year', 'Year requiered').not().isEmpty(),
      check('trailer_link', 'Trailer link requiered').not().isEmpty(),
      validateFields,
   ], trailerPost)

router.put('/:id',
   [
      validateJWT,
      rolesAllowed(roles),
      check('id', 'Invalid ID').isMongoId(),
      check('id').custom(trailerExist),
      validateFields,

   ], trailerPut)

router.delete('/:id',
   [
      validateJWT,
      rolesAllowed(roles),
      check('id', 'Invalid id').isMongoId(),
      check('id').custom(trailerExist),
      validateFields
   ], trailerDelete)


module.exports = router