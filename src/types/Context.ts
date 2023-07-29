import { type Request as ExpressRequest } from "express";
import { type ContextUser } from "./User";

export type RequestContext = ExpressRequest & { user?: ContextUser };
