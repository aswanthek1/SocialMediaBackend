const dotenv = require('dotenv').config()
const express = require('express')
const { errorHandler } = require('./middlewares/errorMiddleware')
const logger = require('morgan')
const colors = require('colors')
const cors = require('cors')
const connectDB = require('./config/db')
const port =process.env.PORT || 5000

connectDB()

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/', require('./routes/userRoutes'))
app.use('/posts',require('./routes/postRouter'))

app.use(errorHandler)
app.listen(port, () => console.log(`Server started at port ${port.rainbow}`))