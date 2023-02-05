const express = require('express')
const router = express.Router()
const { getUser, getoneUser, createUser, updtUser, deleteUser, registerUser, loginUser, getMe } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')


router.route('/me').get(protect, getMe)
router.route('/').get(getUser)
router.route('/:id').get(getoneUser).delete(protect, deleteUser).put(protect, updtUser)

// Authenticate
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)




// router.get('/', getUser)

// router.post('/', createUser)

// router.put('/:id', updtUser)

// router.delete('/:id', deleteUser)

module.exports = router