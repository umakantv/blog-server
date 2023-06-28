const logger = require('../utils/logger');
const LogCodes = require('../utils/LogCodes');

function logRequestReceived(req, res, next) {

    logger.info(LogCodes.REQUEST_RECEIVED, req.meta)

    next();
}

module.exports = logRequestReceived;