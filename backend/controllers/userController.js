const asyncHandler = require('express-async-handler')   // to handle exceptions
const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// @desc    Get users
// @route   GET api/users
// @access  Private

const getUser = asyncHandler(async (req, res) => {
    const users = await User.find().lean()
    const user = await User.findById(req.user.id)
    // console.log(users)
    // res.status(200).json(users)
    res.render('home', { users, member: user.name })
})


// @desc    Get a user
// @route   GET api/user/:id
// @access  Private
const getoneUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400)
        // throw new Error("User not found")
    }

    res.status(200).json(user)

})


// @desc    Create users
// @route   POST api/users
// @access  Public (public bcz if the route is protected you can't register)
const createUser = asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.name || !req.body.email || !req.body.password) { // in order to use a body data we need to add middleware lines in app.js
        res.status(400)
        throw new Error('Please complete all fields') // This throws a default express built in error
    } else {

        const user = await User.create({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password

        })
        res.status(200).json(user)
    }
})


// @desc    Update users
// @route   PUT api/users/:id
// @access  Private
// const updtUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id)

//     if (!user) {
//         res.status(400)
//         throw new Error('User not found')
//     }

//     const updtedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

//     res.status(200).json(updtedUser)
// })


// @desc    Delete users
// @route   DELETE api/users/:id
// @access  Private
// const deleteUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.params.id)

//     if (!user) {
//         res.status(400)
//         throw new Error('User do not exist')
//     }

//     await user.remove()

//     res.status(200).json({ id: req.params.id })
// })








// Authenticate User



// @desc    Register user
// @route   POST api/users/register
// @access  Public


const registerForm = asyncHandler(async (req, res) => {
    if (req.headers.cookie) {
        res.redirect('/api/users')
    } else {
        res.render('register')
    }

})


const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.body //destructuring 

    if (!username || !name || !email || !password) {
        res.status(400)
        throw new Error('Please Complete all fields')
    }

    // Check if user exists
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt() // we need to generate a salt to hash the password
    const hashedPassword = await bcrypt.hash(password, salt) // password comes from the client side -- this will give us the hash password

    // Create a user
    const user = await User.create({
        username, name, email, password: hashedPassword
    })

    if (user) {
        res.redirect('/api/users/login')

        // res.status(201).json({
        //     _id: user.id,
        //     username: user.username,
        //     email: user.email,
        //     token: generateToken(user.id)
        // })
        // res.status(201).json({
        //     _id: user.id,
        //     username: user.username,
        //     email: user.email,
        //     token: generateToken(user.id)
        // })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})


// @desc    Authenticate user
// @route   POST api/user/login
// @access  Public
const loginUserPage = asyncHandler(async (req, res) => {
    if (req.headers.cookie) {
        res.redirect('/api/users')
    } else {
        res.render('login')
    }
})


const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    const users = await User.find().lean()

    if (user && (await bcrypt.compare(password, user.password))) {
        // console.log(user)
        const token = generateToken(user.id)
        res.cookie("token", token)
        res.redirect('/api/users')
        // res.status(200).json({
        // _id: user.id,
        // name: user.name,
        // username: user.username,
        // email: user.email,
        // token: generateToken(user.id)
        // })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


// @desc    Authenticate user
// @route   POST api/user/logout
// @access  private
const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token")
    res.redirect('login')
})


// @desc    Get user data
// @route   Get api/user/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    console.log(req.user)
    const { id, username, name, email } = await User.findById(req.user.id) // we have access of req.user from middleware
    res.status(200).json({
        id: id,
        username,
        name,
        email
    })
})


// @desc    Update users
// @route   PUT api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).lean()

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (req.user.id === req.params.id) {
        res.render('update', { name: user.name, username: user.username, email: user.email })
    } else {
        res.status(401)
        throw new Error('Not authorized')
    }
})


const updtUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (req.user.id === req.params.id) {
        const updtedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.redirect('/api/users')
        // res.status(200).json(updtedUser)
    } else {
        res.status(401)
        throw new Error('Not authorized')
    }


})


// @desc    Delete users
// @route   DELETE api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400)
        throw new Error('User do not exist')
    }
    // await user.remove()

    if (req.user.id === req.params.id) {
        await user.remove()
    } else {
        res.status(401)
        throw new Error('Not authorized')
    }

    const _user = await User.find().lean()
    res.redirect('/api/users')
    // res.status(200).json({ id: req.params.id })
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET) // , { expiresIn: '3d' } sign a new token with the id that is passed in with the secret key used and will expire in 30 days (the id is the data put as our payload)
}



module.exports = {
    getUser, getoneUser, createUser, updtUser, deleteUser, registerUser, loginUser, loginUserPage, getMe, registerForm, updateUser, logout
}