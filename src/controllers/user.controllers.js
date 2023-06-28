const bcrypt = require('bcryptjs');
const userModel = require("../database/user.model");
const GithubService = require('../services/github');
const { generateToken } = require('../utils/tokens');

function generateUserToken(user) {

    return generateToken({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
    });
}

async function fetchUsersPaginated(req, res, next) {

    try {
        const {
            pageSize = 10, 
            page = 1,
            sortBy = 'createdAt',
            sortOrder = 'desc' 
        } = req.query;
    
        const totalUser = await userModel.find().count();
    
        const users = await userModel.find().select('-password')
        .sort({
            [sortBy]: sortOrder === 'asc' ? 1 : -1
        })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    
        return res.send({
            status: 'success',
            data: {
                totalUser,
                users,
                page,
                pageSize
            }
        })
    } catch(err) {
        next(err)
    }

}

async function fetchUser(req, res, next) {

    try {
        const {id} = req.params;
    
        const user = await userModel.findById(id)
    
        if (user) {
            let userResponse = user.toJSON()
    
            delete userResponse.password;
    
            return res.status(200).send({
                status: 'success',
                data: userResponse
            })
    
        } else {
            
            return res.status(500).send({
                status: 'error',
                message: 'User does not exist'
            })
        }
    } catch(err) {
        next(err)
    }

}

async function login(req, res, next) {

    try {
        const user = req.body;
    
        let {email, password} = user;
    
        let existingUser = await userModel.findOne({
            email
        })
    
        if (existingUser) {
            let match = bcrypt.compareSync(password, existingUser.password);
    
            if (match) {
                // produce a JWT token
                let token = generateUserToken(existingUser);
    
                return res.status(200).send({
                    status: 'success',
                    data: {
                        token
                    }
                })
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'Password is wrong'
                })
            }
        } else {
    
            return res.status(400).send({
                status: 'error',
                message: 'User does not exist with the given email'
            })
        }
    }  catch(err) {
        next(err)
    }

}

async function getLoggedInUser(req, res, next) {

    try {
        const {user} = req;
    
        if (user) {
            return res.status(200).send({
                status: 'success',
                data: user
            })
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'User not logged in'
            })
        }
    } catch(err) {
        next(err)
    }

}

async function register(req, res, next) {
    try {

        const user = req.body;
    
        let {name, email, password} = user;
    
        let existingUser = await userModel.findOne({
            email
        })
    
        if (existingUser) {
            return res.status(400).send({
                status: 'error',
                message: 'User already exists with the given email'
            })
        } else {
            password = bcrypt.hashSync(password);
            let user = await userModel.create({
                name, email, password
            })
    
            user = user.toJSON();
    
            delete user.password;
    
            return res.status(200).send({
                status: 'success',
                data: user
            })
        }
    } catch(err) {
        next(err)
    }
}

async function githubSignin(req, res, next) {

    try {
        const {code} = req.query

        let githubService = new GithubService();
        const userDetails = await githubService.getUser(code);

        let existingUser = await userModel.findOne({
            authType: 'github',
            githubUsername: userDetails.login
        });

        if (!existingUser) {
            existingUser = await userModel.create({
                authType: 'github',
                name: userDetails.name,
                githubUsername: userDetails.login,
                image: userDetails.avatar_url,
                email: userDetails.email,
            })
        }
        
        let token = generateUserToken(existingUser);

        return res.status(200).send({
            status: 'success',
            data: {
                token
            }
        })

    } catch(err) {

        next(err);
    }
}

module.exports = {
    fetchUser,
    register,
    login,
    getLoggedInUser,
    githubSignin,
    fetchUsersPaginated,
}