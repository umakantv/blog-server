const blogModel = require("../database/blog.model");
const userModel = require("../database/user.model");
const { validate } = require("../validators");
const { getBlogsValidator, createBlogValidator, idValidator } = require("../validators/blog.validators");

async function getBlogsByUserId(req, res) {

    const error = validate(idValidator, req.params.userId)

    if (error) {
        return res.status(400).send({
            status: 'error',
            message: error,
        })
    }

    const {userId} = req.params;

    const blogs = await blogModel.find({
        'author.authorId': userId,
    }).sort({
        createdAt: -1
    })

    return res.send({
        status: 'success',
        data: blogs
    })
}

async function getBlogsPaginated(req, res) {

    const error = validate(getBlogsValidator, req.query)

    if (error) {
        return res.status(400).send({
            status: 'error',
            message: error,
        })
    }

    try {
        let {
            search = '',
            pageSize = 10, 
            page = 1,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            authorId
        } = req.query;

        const filter = {
            title: {
                $regex: search
            }
        };

        if (authorId) {
            filter['author._id'] = authorId;
        }

        const [totalBlogs, blogs] = await Promise.all([
            blogModel.find(filter).count(), 
            blogModel.find(filter)
                .sort({
                    [sortBy]: sortOrder === 'asc' ? 1 : -1
                })
                .limit(pageSize)
                .skip(pageSize * (page - 1))
            ]);

        return res.send({
            status: 'success',
            data: {
                totalBlogs,
                blogs,
                page,
                pageSize
            }
        })
    } catch(err) {
        return res.status(500).send({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

async function createBlogPost(req, res) {

    const blog = req.body;

    const error = validate(createBlogValidator, blog)

    if (error) {
        return res.status(400).send({
            status: 'error',
            message: error,
        })
    }

    const {user} = req;

    if (!user) {
        return res.status(400).send({
            status: 'error',
            message: 'User not logged in'
        })
    }

    blog.author = {
        _id: user._id,
        name: user.name,
        image: user.image,
    }

    const blogData = await blogModel.create(blog);

    // No need to await this
    userModel.findByIdAndUpdate(user._id, {
        $inc: {
            blogsCount: 1,
        }
    }).then(() => {});

    return res.send({
        status: 'success',
        data: blogData
    })
}

async function getBlogById(req, res) {

    const error = validate(idValidator, req.params.id)

    if (error) {
        return res.status(400).send({
            status: 'error',
            message: error,
        })
    }

    const {id} = req.params;

    const blog = await blogModel.findById(id);

    return res.send({
        status: 'success',
        data: blog
    })
}

module.exports = {
    getBlogsByUserId,
    getBlogsPaginated,
    createBlogPost,
    getBlogById,
}