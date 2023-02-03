const express = require('express')
const router = express.Router()
const {getUser, getoneUser, createUser, updtUser, deleteUser} = require('../controllers/userController')

router.route('/').get(getUser).post(createUser)
router.route('/:id').get(getoneUser).delete(deleteUser).put(updtUser)

// router.get('/', getUser)

// router.post('/', createUser)

// router.put('/:id', updtUser)

// router.delete('/:id', deleteUser)

module.exports = router