import logger from "../utils/logger";
import LogCodes from "../config/LogCodes";
import * as userService from "../services/users.service";
import { verifyToken } from "../utils/tokens";

export default async function auth(req, res, next) {
  let token = req.headers.authorization || "";

  token = token.split(" ")[1];

  if (token) {
    try {
      const result = verifyToken(token);

      let user = await userService.getUser(result._id);

      req.user = user;

      logger.info(LogCodes.AUTHENTICATED_REQUEST, {
        request: {
          ...req.meta,
        },
        user_id: user._id,
      });
    } catch (err) {
      // No action to take
    }
  }

  if (!req.user) {
    logger.warn(LogCodes.UNAUTHENTICATED_REQUEST, {
      request: { ...req.meta },
    });
  }

  next();
}

module.exports = auth;
