
const express = require('express');
const { createComment, getCommentsByPostId, editComment, deleteComment } = require('../controllers/comment.controllers');

const commentRouter = express.Router()

commentRouter.get('/blog/:id', getCommentsByPostId)
commentRouter.post('/', createComment)
commentRouter.patch('/:id', editComment)
commentRouter.delete('/:id', deleteComment)

module.exports = commentRouter;