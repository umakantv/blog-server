
const express = require('express')
const authController = require('../controllers/auth.controllers')

const authRouter = express.Router()

authRouter.get('/loggedInUser', authController.getLoggedInUser)
authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.get('/githubSignin', authController.githubSignin)

module.exports = authRouter;