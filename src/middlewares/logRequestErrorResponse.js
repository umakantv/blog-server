const logger = require('../utils/logger');
const LogCodes = require('../config/LogCodes');
const AppError = require('../utils/AppError');

/**
 * @param {AppError} err
 */
function logRequestErrorResponse(err, req, res, next) {

    const {
        status = 500,
        message = 'Something went wrong',
        code,
        description,
        meta: context,
    } = err;

    logger.error(LogCodes.ERROR_RESPONSE, {
        ...req.meta,
        status,
        error_code: message,
        code,
        description,
        context,
    })

    next(err);
}

module.exports = logRequestErrorResponse;