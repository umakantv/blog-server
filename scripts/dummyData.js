require('dotenv').config({
    path: `./environment/.env.development`
})

const { connectDatabase } = require("../src/database/connectDB.js")
const { faker } = require('@faker-js/faker')
const crypto = require('crypto')
const postModel = require("../src/database/post.model.js")
const userModel = require("../src/database/user.model.js")
const tagModel = require("../src/database/tag.model.js")
const commentsModel = require('../src/database/comment.model.js')
const { createSlug } = require('../src/utils/index.js')

const imageModules = [
    'abstract',
    'animals',
    'business',
    'city',
    'food',
    'nightlife',
    'fashion',
    'people',
    'nature',
    'sports',
    'technics',
    'transport',
]

const allTags = [
    'programming',      'problem-solving',
    'frontend',         'nextjs',
    'implementation',   'algorithm',
    'low-level-design', 'priority-queue',
    'recursion',        'leetcode',
    'javascript',       'database',
    'web-development',  'backend',
    'nodejs',           'performance-tuning',
    'scalability',      'load-balancer'
]

async function createDummyUsers(count) {
    // create 500 dummy users

    const users = []

    for (let i = 0; i < count; i++) {
        const gender = ['Male', 'Female', 'Other'][crypto.randomInt(0, 3)]
        const randomModule = imageModules[crypto.randomInt(0, imageModules.length)]
        let coverImage = faker.image[randomModule](1200, 630, true);

        const user = {
            name: faker.name.fullName({sex: gender}),
            gender,
            image: faker.image.avatar(),
            coverImage: coverImage,
            username: faker.internet.userName(),
            authType: 'email-password',
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        users.push(user);
    }

    console.log(users)
    await userModel.insertMany(users);
}

async function createDummyPosts(count) {
    console.log('Count', count)
    const users = await userModel.find();

    console.log(users.length)
    let blogs = [];

    for (let i = 0; i < count; i++) {
        const author = users[crypto.randomInt(0, users.length)]
        const title = faker.hacker.phrase()
        const paragraphs = faker.lorem.paragraphs(crypto.randomInt(3, 6))
        const randomModule = imageModules[crypto.randomInt(0, imageModules.length)]
        let coverImage = faker.image[randomModule](1200, 630, true)

        let tags = []
        let tagCount = crypto.randomInt(2, 5)

        for (let i = 0; i < tagCount; i++) {
            tags.push(allTags[crypto.randomInt(0, allTags.length)])
        }

        tags = Array.from(new Set(tags))

        let description = paragraphs.split('\n')[0]

        let blog = {
            title,
            slug: createSlug(title) + '-' + Date.now().toString(),
            excerpt: description,
            content: paragraphs,
            author: {
                _id: author._id,
                name: author.name,
                image: author.image
            },
            tags,
            metadata: {
                coverImage,
                ogImage: coverImage,
                seoDescription: description,
            }
        }

        blogs.push(blog);
    }

    await postModel.insertMany(blogs);
    console.log('Done');
}


async function addDummyComments(count) {

    const comments = [];

    const users = await userModel.find();
    const posts = await postModel.find();

    for (let i = 0; i < count; i++) {

        const user = users[crypto.randomInt(0, users.length)];
        const post = posts[crypto.randomInt(0, posts.length)];

        post.commentCount++;

        const comment = {
            content: faker.lorem.paragraphs(crypto.randomInt(2, 4)),
            author: {
                userId: user._id,
                name: user.name,
                image: user.image,
            },
            postId: post._id,
        }

        comments.push(comment);
    }

    for(const post of posts) {
        await post.save();
    }

    await commentsModel.create(comments);

    console.log('Added comments');

}

async function addTags() {
    await tagModel.create(allTags.map(tag => ({
        name: tag
    })))
    console.log('Added tags')
}

connectDatabase()
// .then(() => addTags())
// .then(() => createDummyUsers(500))
.then(() => addDummyComments(10000))