import { type Request as ExpressRequest } from "express";
import { type ContextUser } from "./User";

export type RequestMeta = {
  request_id: string;
  method: string;
};

export type RequestContext = ExpressRequest & { user?: ContextUser } & {
  meta: RequestMeta;
};
