const Joi = require("joi");
const { validate } = require("./index");
const AppError = require("../utils/AppError");

const username = Joi.string()
  .required()
  .min(4)
  .regex(/^[_a-z0-9]+$/);
const email = Joi.string().required().email();
const password = Joi.string().required().min(6);

const register = Joi.object({
  name: Joi.string().required().min(4),
  username,
  email,
  password,
}).required();

const loginWithEmail = Joi.object({
  email,
  password,
}).required();

const loginWithUsername = Joi.object({
  username,
  password,
}).required();

/**
 *
 * @param {string} emailOrUsername
 * @param {string} password
 */
function validateLoginCredentials(emailOrUsername, password) {
  if (emailOrUsername.includes("@")) {
    return validate(loginWithEmail, {
      email: emailOrUsername,
      password,
    });
  } else {
    validateUsername(emailOrUsername);
    return validate(loginWithUsername, {
      username: emailOrUsername,
      password,
    });
  }
}

function validateUsername(value) {
  try {
    validate(username, value);
  } catch (err) {
    throw new AppError("Not a valid username", 400);
  }
}

const githubSigninCode = Joi.string().required().min(10);

module.exports = {
  register,
  githubSigninCode,
  email,
  password,
  username,
  validateLoginCredentials,
  validateUsername,
};
