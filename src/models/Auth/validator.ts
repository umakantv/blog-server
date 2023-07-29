import Joi from "joi";
import { validate } from "../../packages/Validator/index";
import AppError from "../../packages/Error/AppError";

export const username = Joi.string()
  .required()
  .min(4)
  .regex(/^[_a-z0-9]+$/);
export const email = Joi.string().required().email();
export const password = Joi.string().required().min(6);

export const register = Joi.object({
  name: Joi.string().required().min(4),
  username,
  email,
  password,
}).required();

export const loginWithEmail = Joi.object({
  email,
  password,
}).required();

export const loginWithUsername = Joi.object({
  username,
  password,
}).required();

/**
 *
 * @param {string} emailOrUsername
 * @param {string} password
 */
export function validateLoginCredentials(
  emailOrUsername: string,
  password: string
) {
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

export function validateUsername(value: string) {
  try {
    validate(username, value);
  } catch (err) {
    throw new AppError("Not a valid username", 400);
  }
}

export const githubSigninCode = Joi.string().required().min(10);
