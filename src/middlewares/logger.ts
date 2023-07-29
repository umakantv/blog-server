import morgan from "morgan";
import logger from "../packages/Logs/logger";
import LogCodes from "../packages/Logs/LogCodes";

const httpLogger = morgan(
  function (tokens, req: any, res) {
    // console.log('Request route', req.route)
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      contentLength: tokens.res(req, res, "content-length"),
      responseTime: tokens["response-time"](req, res),
      requestId: req.headers.request_id,
      // route: req.route.path,
      request_meta: req.meta,
    });
  },
  {
    stream: {
      write: (message) => {
        const {
          method,
          url,
          status,
          contentLength,
          responseTime,
          requestId,
          request_meta,
          // route,
        } = JSON.parse(message);

        logger.info(LogCodes.REQUEST_RESPONSE, {
          timestamp: new Date().toISOString(),
          status: Number(status),
          content_length: contentLength,
          response_time: Number(responseTime),
          request: {
            ...request_meta,
            url,
            method,
            request_id: requestId,
          },
        });
      },
    },
  }
);

export default httpLogger;
