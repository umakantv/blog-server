const Joi = require("joi");
const AppError = require("../utils/AppError");

/**
 *
 * @param {Joi.AnySchema} validator
 * @param {any} data
 * @returns {null | string}
 */
function validate(validator, data) {
  let result = validator.validate(data);

  if (result.error instanceof Joi.ValidationError) {
    throw new AppError(result.error.message, 400);
  }

  return null;
}

module.exports = { validate };
