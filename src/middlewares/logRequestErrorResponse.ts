import logger from "../utils/logger";
import LogCodes from "../config/LogCodes";
import AppError from "../utils/AppError";

/**
 * @param {AppError} err
 */
export default function logRequestErrorResponse(err, req, res, next) {
  const {
    status = 500,
    message = "Something went wrong",
    code,
    description,
    meta: context,
  } = err;

  logger.error(LogCodes.ERROR_RESPONSE, {
    status,
    error_code: message,
    code,
    description,
    request: {
      ...req.meta,
    },
    context,
  });

  next(err);
}
