import logger from "../packages/Logs/logger";
import LogCodes from "../packages/Logs/LogCodes";

export default function logRequestReceived(req, res, next) {
  logger.info(LogCodes.REQUEST_RECEIVED, {
    request: { ...req.meta },
  });

  next();
}
