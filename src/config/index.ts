import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `./environment/.env.${NODE_ENV}`,
});

const {
  PORT = 3050,
  JWT_SECRET,
  DB_CONNECTTION_STRING,
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  APP_NAME = "blog-server",
} = process.env;

const CAPTURE_PROMETHEUS_METRIC =
  parseInt(process.env.CAPTURE_PROMETHEUS_METRIC) || 0;
const TRACE_ENDPOINT =
  process.env.TRACE_ENDPOINT || "http://localhost:14268/api/traces";

const EMAIL_SMTP = process.env.EMAIL_SMTP;
const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export default {
  NODE_ENV,
  PORT,
  APP_NAME,
  JWT_SECRET,
  DB_CONNECTTION_STRING,
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  CAPTURE_PROMETHEUS_METRIC,
  TRACE_ENDPOINT,
  EMAIL: {
    EMAIL_SMTP,
    EMAIL_ID,
    EMAIL_PASSWORD,
  },
};
