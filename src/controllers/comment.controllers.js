const blogModel = require("../database/post.model");
const commentsModel = require("../database/comment.model");

async function getBlogComments(postId) {
    return commentsModel.find({
        postId
    }).sort({
        createdAt: -1
    })
}

async function getCommentsByPostId(req, res, next) {
    try {
        const {id} = req.params;
    
        const comments = await getBlogComments(id);
    
        return res.send({
            status: 'success',
            data: comments
        })
    } catch(err) {
        next(err)
    }
}

async function createComment(req, res, next) {

    try {
        const comment = req.body;
        const {user} = req;
    
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: 'User not logged in'
            })
        }
    
        comment.author = {
            _id: user._id,
            name: user.name,
            image: user.image,
        }
    
        if (!comment.blogId) {
            throw new Error('Blog id is not provided');
        }
        
        const commentData = await commentsModel.create(comment);
    
        // https://www.mongodb.com/docs/manual/reference/operator/update/inc/#example
        await blogModel.findByIdAndUpdate(comment.blogId, {
            $inc: {
                commentCount: 1,
            }
        })
    
        return res.send({
            status: 'success',
            data: commentData
        })
    } catch(err) {

        next(err)
    }
}

// TODO
/**
 * Delete a comment from a post and decrease the comment count
 * 
 * User must not be able to delete other users' comments
 */
async function deleteComment(req, res) {}

// TODO
/**
 * Edit comment content
 * 
 * User must be able to edit only comments that are authored by him/her
 */
async function editComment(req, res) {}

module.exports = {
    getBlogComments,
    createComment,
    getCommentsByPostId,
    editComment,
    deleteComment
}