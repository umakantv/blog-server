import mongoose from "mongoose";
import AppError from "../../packages/Error/AppError";
import { ErrorCodes } from "../../packages/Error/Errors";

export class BaseRepo {
  protected modelName: string;
  protected model: mongoose.Model<any>;

  constructor(modelName: string, ModelSchema: any) {
    this.modelName = modelName;
    this.model = mongoose.model(modelName, ModelSchema);
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findOne(options: any, projections?: any, failIfDoesNotExist = true) {
    const entity = await this.model.findOne(options, projections);

    if (entity) {
      return entity;
    } else if (failIfDoesNotExist) {
      throw new AppError(
        `${this.modelName} does not exist.`,
        404,
        ErrorCodes.ENTITY_NOT_FOUND
      );
    }
  }

  async findMany(options?: any, projections?: any) {
    return this.model.find(options, projections);
  }

  async createUnique(data: any, findOneOptions?: any) {
    let entity = await this.model.findOne(findOneOptions || data);

    if (entity) {
      throw new AppError(`${this.modelName} already exists.`, 400);
    } else {
      entity = new this.model(data);
      await entity.save();
      return entity;
    }
  }

  async create(data) {
    return this.model.create(data);
  }

  async updateEntityById(id: any, entityUpdateFields: any, entity?: any) {
    entity = entity || (await this.model.findOne({ _id: id }));

    if (!entity) {
      throw new AppError(
        `${this.modelName} does not exist.`,
        404,
        ErrorCodes.ENTITY_NOT_FOUND
      );
    }

    for (const [key, value] of Object.entries(entityUpdateFields)) {
      entity[key] = value;
    }

    await entity.save();
    return entity;
  }

  async deleteById(id: string) {
    let entity = await this.model.findOneAndDelete({ _id: id });

    if (!entity) {
      throw new AppError(
        `${this.modelName} does not exist.`,
        404,
        ErrorCodes.ENTITY_NOT_FOUND
      );
    }

    return entity;
  }
}
