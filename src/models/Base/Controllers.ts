import { Response } from "express";
import AppError from "../../packages/Error/AppError";
import { ErrorCodes } from "../../packages/Error/Errors";
import { RequestContext } from "../../types/Context";
import { BaseService } from "./Service";
import { BaseValidator } from "./Validators";

export class BaseController {
  service: BaseService;
  validators: BaseValidator;

  constructor(service: BaseService, validators: BaseValidator) {
    this.service = service;
    this.validators = validators;
  }

  authenticateUser(req: RequestContext, checkVerified = true) {
    const { user } = req;

    if (!user) {
      throw new AppError(
        "You are not logged in. Please login first.",
        401,
        ErrorCodes.UNAUTHENTICATED
      );
    }
    if (checkVerified && !user.verified) {
      throw new AppError(
        "Please verify your email first.",
        401,
        ErrorCodes.UNVERIFIED_EMAIL
      );
    }
  }

  async get(req: RequestContext, res: Response) {
    const { id } = req.params;
    return this.service.findOne({
      _id: id,
    });
  }

  async getAll(req: RequestContext, res: Response) {
    return this.service.findMany();
  }

  async post(req: RequestContext, res: Response) {
    return this.service.createUnique(req.body);
  }

  async put(req: RequestContext, res: Response) {
    const { id } = req.params;
    return this.service.updateById(id, req.body);
  }

  async delete(req: RequestContext, res: Response) {
    const { id } = req.params;
    return this.service.deleteById(id);
  }
}
