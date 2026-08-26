const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const app = express()

const { signup, login } = require('./src/controllers/auth.controller')
const tokenVerify  = require('./src/middleware/auth.middleware')

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.Database_URL)
    .then(() => console.log('the database is connected'))
    .catch((err) => console.error('the database is not connected', err))

app.post('/signup', signup)
app.post('/login', login)

app.listen(3000, () => {
    console.log('the app is running on 3000 port')
})