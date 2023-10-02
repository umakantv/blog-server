import express from "express";
import cors from "cors";
import auth from "./auth";
import { updateMetrics } from "./metrics";
import handleRequestException from "./handleRequestException";
import logRequestErrorResponse from "./logRequestErrorResponse";
import logger from "./logger";

export function initiatePreResponseMiddlewares(
  app,
  { captureMetrics }: { captureMetrics: boolean } = {
    captureMetrics: true,
  }
) {
  app.use(cors());
  app.use(express.json());
  app.use(logger);
  app.use(auth);
  if (captureMetrics) {
    app.use(updateMetrics);
  }
}

export function initiatePostResponseMiddlewares(app) {
  app.use(logRequestErrorResponse);
  app.use(handleRequestException);
}
