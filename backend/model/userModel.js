const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: { type: String, unique: [true, 'Please create another username'] },
    name: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, unique: [true, 'Please create another email'] },
    password: { type: String, required: [true, 'Please add a password'] }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema) // compile our schema into the model we can work with
