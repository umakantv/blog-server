const {
  PORT,
  CAPTURE_PROMETHEUS_METRIC,
  APP_NAME,
  NODE_ENV,
} = require("./config");

console.log("Starting server with env:", NODE_ENV);

const path = require("path");
require("./utils/tracing")(APP_NAME);
const express = require("express");

const { connectDatabase } = require("./database/connectDB");
const initiateRoutes = require("./routes");
const {
  initiatePreResponseMiddlewares,
  initiatePostResponseMiddlewares,
} = require("./middlewares");

const app = express();

// Standard Middlewares
initiatePreResponseMiddlewares(app, {
  captureMetrics: CAPTURE_PROMETHEUS_METRIC,
});

// Custom Middlewares
initiateRoutes(app);

// Middlewares after response is sent
initiatePostResponseMiddlewares(app);

app.use(express.static("public"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on http://localhost:3050");
  });
});
