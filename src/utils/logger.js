const winston = require('winston');
const { NODE_ENV } = require('../config');

const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const addTimestamp = winston.format(info => {
  info.timestamp = new Date().toISOString();
  return info;
});

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    addTimestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  defaultMeta: {
    env: NODE_ENV,
  },
  exitOnError: false
})

module.exports = logger