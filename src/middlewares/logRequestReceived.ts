import logger from "../utils/logger";
import LogCodes from "../config/LogCodes";

export default function logRequestReceived(req, res, next) {
  logger.info(LogCodes.REQUEST_RECEIVED, {
    request: { ...req.meta },
  });

  next();
}
