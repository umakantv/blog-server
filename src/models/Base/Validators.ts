import AppError from "../../packages/Error/AppError";
import { ErrorCodes } from "../../packages/Error/Errors";

export class BaseValidator {
  validationSchemas: any;

  constructor(validationSchemas: any) {
    this.validationSchemas = validationSchemas;
  }

  validate(schemaName: string, data: any) {
    const validationSchema = this.validationSchemas[schemaName];

    if (!validationSchema) {
      throw new AppError("Could not validate this request.", 500);
    }

    const validationResponse = validationSchema.validate(data);

    if (validationResponse.error) {
      throw new AppError(
        validationResponse.error,
        400,
        ErrorCodes.INVALID_INPUT
      );
    }
  }
}
