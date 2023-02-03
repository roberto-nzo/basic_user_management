const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {type: String, unique: [true, 'Username already exist in our database']},
    name: String,
    email: {type: String, unique: [true, 'Email already exist in our database']},
    password: String
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema) // compile our schema into the model we can work with
