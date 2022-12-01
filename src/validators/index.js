const Joi = require('joi');

/**
 * 
 * @param {Joi.AnySchema} validator 
 * @param {any} data 
 * @returns {null | string}
 */
function validate(validator, data) {
    let result = validator.validate(data);

    if (result.error instanceof Joi.ValidationError) {
        return result.error.message;
    }

    return null;
}

module.exports = {validate}