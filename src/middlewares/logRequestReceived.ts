import logger from "../packages/Logs/logger";
import LogCodes from "../packages/Logs/LogCodes";
import { RequestContext } from "../types/Context";
import { Response } from "express";

export default function logRequestReceived(
  req: RequestContext,
  res: Response,
  next: any
) {
  logger.info(LogCodes.REQUEST_RECEIVED, {
    request: { ...req.meta },
  });

  next();
}
