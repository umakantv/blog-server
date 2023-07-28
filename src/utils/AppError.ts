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
    this.description = description;
    this.meta = meta;
  }
}
