const express = require('express')
const router = express.Router()
const { getUser, getoneUser, createUser, updtUser, deleteUser, registerUser, loginUserPage, getMe, loginUser, registerForm, updateUser } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware')


router.route('/me').get(protect, getMe)
router.route('/').get(getUser)

// Authenticate
router.route('/register').get(registerForm)
router.route('/register').post(registerUser)
// router.route('/register').post(loginUser)
router.route('/login').get(loginUserPage).post(loginUser)
// router.route('/:id').get(getoneUser).delete(protect, deleteUser).put(protect, updtUser)
router.route('/delete/:id').get(deleteUser)
router.route('/update/:id').get(updateUser).post(updtUser)




// router.get('/', getUser)

// router.post('/', createUser)

// router.put('/:id', updtUser)

// router.delete('/:id', deleteUser)

module.exports = router