const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

// @desc    Get users
// @route   GET api/users
// @access  Private
const getUser = asyncHandler(async(req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})


// @desc    Get a user
// @route   GET api/user/:id
// @access  Private
const getoneUser = asyncHandler(async(req, res) =>{
    const user = await User.findById(req.params.id)

    if (!user){
        res.status(400)
        // throw new Error("User not found")
    }

    res.status(200).json(user)
    
})


// @desc    Create users
// @route   POST api/users
// @access  Private
const createUser = asyncHandler(async(req, res) => {
    if (!req.body.username && !req.body.name && !req.body.email && !req.body.password){ // in order to use a body data we need to add middleware lines in app.js
        res.status(400)
        throw new Error('Please complete all fields') // This throws a default express built in error
    }

    const user = await User.create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    
    res.status(200).json(user)
})


// @desc    Update users
// @route   PUT api/users/:id
// @access  Private
const updtUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)

    if (!user){
        res.status(400)
        throw new Error('User not found')
    }

    const updtedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json(updtedUser)
})


// @desc    Delete users
// @route   DELETE api/users/:id
// @access  Private
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(400)
        throw new Error('User do not exist')
    }

    await user.remove()

    res.status(200).json({id: req.params.id})
})


module.exports = {
    getUser, getoneUser, createUser, updtUser, deleteUser
}