const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 10
    },
    excerpt: String,
    author: {
        _id: String,
        name: String,
        image: String,
    },
    slug: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true,
    },
    metadata: {
        coverImage: String,
        seoDescription: String,
        ogImage: String,
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const postModel = mongoose.model('posts', postSchema)

module.exports = postModel;