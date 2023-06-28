
const express = require('express');
const { createPost, getPostsPaginated, getPostById, getPostsByTag } = require('../controllers/post.controllers');

const blogRouter = express.Router()

blogRouter.post('/', createPost)
blogRouter.get('/:id', getPostById)
blogRouter.get('/', getPostsPaginated)

module.exports = blogRouter;