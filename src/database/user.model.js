const mongoose = require("mongoose");

// Step 2. Define the Schema
const userSchema = new mongoose.Schema({
    name: String,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    image: String,
    coverImage: String,
    username: String,
    githubUsername: String,
    authType: {
        type: String,
        enum: ['github', 'google', 'facebook', 'email-password'],
        default: 'email-password'
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        minLength: 8
    },
    blogsCount: {
        type: Number,
        default: 0,
    },
    followingCount: {
        type: Number,
        default: 0,
    },
    followerCount: {
        type: Number,
        default: 0,
    },
})

// Step 3. Create a model using the schema related to the collection
const userModel = mongoose.model('users', userSchema) // users

module.exports = userModel;