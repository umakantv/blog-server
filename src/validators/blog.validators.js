const Joi = require('joi');

const createBlog = Joi.object({
    title: Joi.string().required().min(10),
    content: Joi.string().required().min(100).max(50000),
}).required()

const id = Joi.string().required().min(10);

const getBlogs = Joi.object({
    search: Joi.string().empty(),
    authorId: Joi.string().empty(),
    pageSize: Joi.number().min(3).max(40).required(),
    page: Joi.number().min(1).required(),
    sortBy: Joi.string().valid('createdAt','updatedAt','likeCount'),
    sortOrder: Joi.string().valid('asc', 'desc')
}).required();

module.exports = {
    getBlogsValidator: getBlogs,
    createBlogValidator: createBlog,
    idValidator: id,
}