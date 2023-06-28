
const express = require('express')
const userController = require('../controllers/user.controllers')

const userRouter = express.Router()

userRouter.get('/all', userController.fetchUsersPaginated)
userRouter.get('/:id', userController.fetchUser)

module.exports = userRouter;