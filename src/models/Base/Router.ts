import express, { Response, Router } from "express";
import { BaseController } from "./Controllers";
import logger from "../../packages/Logs/logger";
import LogCodes from "../../packages/Logs/LogCodes";
import { checkObjectHasSecureFieldsRecursively } from "../../utils/helpers";
import { RequestContext } from "../../types/Context";
import { randomUUID } from "crypto";

export class BaseRouter {
  controller: BaseController;
  router: Router;

  constructor(controller: BaseController) {
    this.controller = controller;
    this.router = express.Router();
  }

  use(...handlers: any[]) {
    this.router.use(...handlers);
  }

  registerRoute(
    httpMethod: string,
    path: string,
    routeName: string,
    controllerMethod: string,
    ...middlewares: any[]
  ) {
    this.router[httpMethod](
      path,
      ...middlewares,
      this.baseHandler(controllerMethod, path, routeName)
    );
  }

  requestEntryMiddleware(req: RequestContext, res: Response, next: Function) {
    let requestId = req.headers.request_id;

    if (!requestId) {
      requestId = randomUUID();

      req.headers.request_id = requestId;

      req.meta = {
        request_id: req.headers.request_id,
        method: req.method,
      };
    }
  }

  baseHandler(method: string, path: string, routeName: string) {
    return async (req: RequestContext, res: Response, next: Function) => {
      try {
        this.requestEntryMiddleware(req, res, next);

        logger.info(LogCodes.REQUEST_RECEIVED, {
          request: { ...req.meta, path, routeName },
        });

        const response = await this.controller[method](req, res, next);

        if (checkObjectHasSecureFieldsRecursively(response)) {
          logger.warn(LogCodes.RESPONSE_HAS_SECURE_FIELDS, {
            error: "Response contains sensitive fields.",
            timestamp: new Date(),
            request: {
              path: req.path,
            },
            response,
          });
        }

        return res.send({
          status: "SUCCESS",
          data: response,
        });
      } catch (err) {
        console.error(err);

        let body = req.body;
        let error = err.message;
        let status = err.code || 500;

        if (checkObjectHasSecureFieldsRecursively(body)) {
          body = { message: "Body replaced due to security input" };
        }

        logger.error(LogCodes.ERROR_RESPONSE, {
          error,
          status,
          request: {
            path: req.path,
            body,
          },
        });

        const response = {
          status: "ERROR",
          error,
          data: null,
          errorCode: null,
        };

        if (err.errorCode) {
          response.errorCode = err.errorCode;
        }

        return res.status(status).send(response);
      }
    };
  }
}
