require('dotenv').config({
    path: `./environment/.env.development`
})

const { connectDatabase } = require("../src/database/connectDB.js")
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')
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

    const password = bcrypt.hashSync('password');

    for (let i = 0; i < count; i++) {
        const gender = ['male', 'female', 'other'][crypto.randomInt(0, 3)]
        const randomModule = imageModules[crypto.randomInt(0, imageModules.length)]
        let coverImage = faker.image.urlLoremFlickr({ category: randomModule, width: 1200, height: 630 });
        // let profileImage = faker.image.urlLoremFlickr({ category: gender, height: 240, width: 240 });

        const user = {
            name: faker.person.fullName({sex: gender}),
            gender,
            image: faker.image.avatarLegacy(),
            coverImage: coverImage,
            username: faker.internet.userName(),
            authType: 'email-password',
            email: faker.internet.email(),
            password,
        }

        users.push(user);
    }

    console.log('Added', users.length, 'users')
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
        let coverImage = faker.image.urlLoremFlickr({ category: randomModule, width: 1200, height: 630 });

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
                username: author.username,
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
                username: user.username,
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
.then(() => createDummyPosts(5000))
.then(() => addDummyComments(15000))