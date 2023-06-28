const postRouter = require('./post.routes');
const userRouter = require('./user.routes');
const commentRouter = require('./comment.routes');
const followerRouter = require('./following.routes');
const likeRouter = require('./like.routes');
const authRouter = require('./auth.routes');

function initiateRoutes(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/comments', commentRouter);
    app.use('/api/follows', followerRouter);
    app.use('/api/likes', likeRouter);
}

module.exports = initiateRoutes;