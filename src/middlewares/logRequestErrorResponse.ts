import logger from "../packages/Logs/logger";
import LogCodes from "../packages/Logs/LogCodes";
import AppError from "../packages/Error/AppError";

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
