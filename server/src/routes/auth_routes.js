const express = require('express')
const { signup, login, forgotPassword, resetPassword } = require('../controllers/auth.controller')

const AuthRouter = express.Router()

AuthRouter.post('/signup', signup)
AuthRouter.post('/login', login)

AuthRouter.post('/forgot-password', forgotPassword)
AuthRouter.post('/reset-password/:token', resetPassword)

module.exports = { AuthRouter }