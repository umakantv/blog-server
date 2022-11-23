const blogRouter = require('./blog.routes');
const userRouter = require('./user.routes');
const commentRouter = require('./comment.routes');
const followerRouter = require('./following.routes');
const likeRouter = require('./like.routes');


function initiateRoutes(app) {
    app.use('/api/user', userRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/comment', commentRouter);
    app.use('/api/follow', followerRouter);
    app.use('/api/like', likeRouter);
}

module.exports = initiateRoutes;