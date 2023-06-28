const postModel = require("../database/post.model");
const userModel = require("../database/user.model");
const { createSlug } = require("../utils");
const AppError = require("../utils/AppError");
const { validate } = require("../validators");
const { getBlogsValidator, createBlogValidator, idValidator } = require("../validators/blog.validators");

async function getPosts({
    search,
    tag,
    pageSize,
    page,
    sortBy,
    sortOrder,
    authorId,
}) {

    const error = validate(getBlogsValidator, {
        search,
        tag,
        pageSize,
        page,
        sortBy,
        sortOrder,
        authorId,
    })

    if (error) {
        throw new AppError(error, 400)
    }

    try {

        const filter = {
            title: {
                $regex: search
            }
        };

        if (authorId) {
            filter['author._id'] = authorId;
        }

        if (tag) {
            filter['tags'] = {
                $elemMatch: {
                    $eq: tag
                }
            };
        }

        const [totalBlogs, blogs] = await Promise.all([
            postModel.find(filter).count(), 
            postModel.find(filter)
                .sort({
                    [sortBy]: sortOrder === 'asc' ? 1 : -1
                })
                .limit(pageSize)
                .skip(pageSize * (page - 1))
            ]);

        return {
            totalBlogs,
            blogs,
            page,
            pageSize
        }
    } catch(err) {
        console.error(err)

        throw new AppError('Something went wrong', 500)
    }
}

async function createPost(post, user) {

    const error = validate(createBlogValidator, post)

    if (error) {
        throw new AppError(error, 400)
    }

    if (!user) {
        throw new AppError('User not logged in', 401)
    }

    post.author = {
        _id: user._id,
        name: user.name,
        image: user.image,
    }

    post.slug = createSlug(post.title) + '-' + Date.now().toString();

    const blogData = await postModel.create(post);

    // No need to await this
    userModel.findByIdAndUpdate(user._id, {
        $inc: {
            blogsCount: 1,
        }
    }).then(() => {});

    return blogData
}

async function getPostBySlug(slug) {

    const error = validate(idValidator, slug)
    
    if (error) {
        throw new AppError(error, 400);
    }

    return postModel.findOne({
        slug
    });
}

module.exports = {
    getPosts,
    createPost,
    getPostBySlug,
}