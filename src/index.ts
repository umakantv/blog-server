import config from "./config/index";
// import trace from "./utils/tracing";
import express from "express";
import { connectDatabase } from "./database/connectDB";
import initiateRoutes from "./routes";
import {
  initiatePreResponseMiddlewares,
  initiatePostResponseMiddlewares,
} from "./middlewares";

// console.log("Starting server with env:", config.NODE_ENV);
// trace(config.APP_NAME);

const app = express();

// Standard Middlewares
initiatePreResponseMiddlewares(app, {
  captureMetrics: Boolean(config.CAPTURE_PROMETHEUS_METRIC),
});

// Custom Middlewares
initiateRoutes(app);

// Middlewares after response is sent
initiatePostResponseMiddlewares(app);

connectDatabase().then(() => {
  app.listen(config.PORT, () => {
    console.log("Listening on http://localhost:3050");
  });
});
