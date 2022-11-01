const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middlewares/errorMiddleware')
const colors = require('colors')
const connectDB = require('./config/db')
const port =process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/userRoutes'))

app.use(errorHandler)
app.listen(port, () => console.log(`Server started at port ${port}`))