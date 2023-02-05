const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')



// It is sent in headers and in the http headers, there is an authorization object, which is what we wanna check
const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { //when the token is sent in the authorization header it's formatted like -- Bearer <and whatever the token is> bcz it is a bearer token
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1]

            // Verify 
            const decoded = jwt.verify(token, process.env.JWT_SECRET) // this allows us to get the payload (verify method decode the token so that we can get the payload, which in this case is the id)

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password')    // we wanna assign the user to req.user so that we can access req.user in any route that is protected

            next() // at the end of our middleware we wanna call the next piece of middleware
        } catch (error) {
            console.log(error)
            res.status(401) // 401 error means not authorized
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})


module.exports = protect