const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const GithubService = require("./github");
const userModel = require("../database/user.model");
const { generateToken } = require("../utils/tokens");
let githubService = new GithubService();

function generateUserToken(user) {
  return generateToken(user);
}

async function login(email, password) {
  let existingUser = await userModel.findOne({
    email,
  });

  if (existingUser) {
    let match = bcrypt.compareSync(password, existingUser.password);

    if (match) {
      // produce a JWT token
      let user = existingUser.toJSON();
      delete user.password;

      let token = generateUserToken(user);

      return { user, token };
    } else {
      throw new AppError("Password is wrong", 400);
    }
  } else {
    throw new AppError("User does not exist with the given email", 400);
  }
}

async function register({ name, email, password }) {
  let existingUser = await userModel.findOne({
    email,
  });

  if (existingUser) {
    throw new AppError("User already exists with the given email", 400);
  } else {
    password = bcrypt.hashSync(password);
    let user = await userModel.create({
      name,
      email,
      password,
    });

    user = user.toJSON();

    delete user.password;

    return user;
  }
}

async function githubSignin(code) {
  const userDetails = await githubService.getUser(code);

  let existingUser = await userModel.findOne({
    authType: "github",
    githubUsername: userDetails.login,
  });

  if (!existingUser) {
    existingUser = await userModel.create({
      authType: "github",
      name: userDetails.name,
      githubUsername: userDetails.login,
      image: userDetails.avatar_url,
      email: userDetails.email,
    });
  }

  let user = existingUser.toJSON();
  delete user.password;

  let token = generateUserToken(user);

  return { token, user };
}

module.exports = {
  login,
  register,
  githubSignin,
};
