const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const dotenv = require('dotenv').config() // This allows us to have .env file with our environment variables in it
const colors = require('colors')
const connectDB = require('./config/db')
const port = process.env.PORT || 8000
const { errorHandler } = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')

// Connect to database
connectDB()

// Init express
const app = express()
const staticDirectory = path.join(__dirname, 'public')

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' })) // we set the template engine to handlebars
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars') // we set the view engine
app.set(express.static(staticDirectory))


//Middleware
app.use(express.json()) // body parser of raw json
app.use(express.urlencoded({ extended: false })) // parser of urlEncoded bodies


app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)
app.use(cookieParser)

app.listen(port, () => console.log(`Server running on port ${port}`))