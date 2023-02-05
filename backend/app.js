const express = require('express')
const dotenv = require('dotenv').config() // This allows us to have .env file with our environment variables in it
const colors = require('colors')
const connectDB = require('./config/db')
const port = process.env.PORT || 8000
const { errorHandler } = require('./middleware/errorHandler')

// Connect to database
connectDB()

// Init express
const app = express()

//Middleware
app.use(express.json()) // body parser of raw json
app.use(express.urlencoded({ extended: false })) // parser of urlEncoded bodies


app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port ${port}`))