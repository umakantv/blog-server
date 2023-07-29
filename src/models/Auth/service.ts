import bcrypt from "bcryptjs";
import AppError from "../../packages/Error/AppError";
import GithubService from "../../services/GithubOAuth/github";
import userModel from "../User/repo";
import { generateToken } from "../../utils/tokens";
import { validate } from "../../packages/Validator";
import * as authValidators from "./validator";

let githubService = new GithubService();

function generateUserToken(user) {
  return generateToken(user);
}

export async function login(emailOrUsername: string, password: string) {
  authValidators.validateLoginCredentials(emailOrUsername, password);

  let existingUser = await userModel.findOne({
    $or: [
      {
        email: emailOrUsername,
      },
      {
        username: emailOrUsername,
      },
    ],
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

export async function register({ name, username, email, password }) {
  authValidators.validateUsername(username);
  validate(authValidators.register, {
    name,
    email,
    username,
    password,
  });

  let existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new AppError(
      "User already exists with the given email or username",
      400
    );
  } else {
    password = bcrypt.hashSync(password);
    let user = await userModel.create({
      name,
      username,
      email,
      password,
    });

    let userData = user.toJSON();

    delete userData.password;

    return userData;
  }
}

export async function githubSignin(code: string) {
  validate(authValidators.githubSigninCode, code);

  const userDetails = await githubService.getUser(code);

  let existingUser = await userModel.findOne({
    authType: "github",
    githubUsername: userDetails.login,
  });

  if (!existingUser) {
    existingUser = await userModel.create({
      authType: "github",
      name: userDetails.name,
      username: userDetails.login,
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

export async function checkUsernameTaken(username: string) {
  authValidators.validateUsername(username);

  let existingUser = await userModel.findOne({
    username,
  });

  if (existingUser) return true;

  return false;
}
