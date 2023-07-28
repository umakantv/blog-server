import express from "express";
import morgan from "morgan";
import {
  collectDefaultMetrics,
  register,
  Counter,
  Gauge,
  Histogram,
} from "prom-client";
import config from "../config";

const appName = config.APP_NAME;

collectDefaultMetrics({
  //   timeout: 5000,
  //   prefix: 'node_app_',
  labels: {
    app: appName,
  },
});

const app = express();

// Customized Http Metrics (Optional)
const httpMetricsLabelNames = ["method", "route", "app"];

// Buckets of response time for each route grouped by seconds
const httpRequestDurationBuckets = new Histogram({
  name: "nodejs_http_response_time",
  help: "Response time of all requests",
  labelNames: [...httpMetricsLabelNames, "code"],
});

// Count of all requests - gets increased by 1
const totalHttpRequestCount = new Counter({
  name: "nodejs_http_total_count",
  help: "Total Requests",
  labelNames: [...httpMetricsLabelNames, "code"],
});

// Response time for each route's last request
const totalHttpRequestDuration = new Gauge({
  name: "nodejs_http_total_duration",
  help: "Response time of the Last Request",
  labelNames: httpMetricsLabelNames,
});

app.use(morgan("dev"));

export function updateMetrics(req, res, next) {
  let startTime = new Date().valueOf();
  res.addListener("finish", () => {
    // console.log(req.method, req.route, res.statusCode);
    let responseTime = (new Date().valueOf() - startTime) / 1000; // convert milliseconds to seconds
    totalHttpRequestDuration
      .labels(req.method, req.route.path, appName)
      .set(responseTime);
    totalHttpRequestCount
      .labels(req.method, req.route.path, appName, res.statusCode)
      .inc();
    httpRequestDurationBuckets
      .labels(req.method, req.route.path, appName, res.statusCode)
      .observe(responseTime);
  });
  next();
}

app.get("/metrics", async (_, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

export default app;
