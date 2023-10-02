import { Errors } from "./Errors";

export default class AppError extends Error {
  status: any;
  code: string;
  description: string;
  meta: any;
  constructor(
    error: any,
    status?: any,
    code?: string,
    description?: string,
    meta?: any
  ) {
    super(error);
    this.status = status;
    this.code = code;

    const errorObject = Errors[error] || Errors["UNKNOWN_ERROR"];
    this.description = description || errorObject.description;
    this.meta = meta;
  }
}
