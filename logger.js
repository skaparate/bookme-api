const { createLogger, format, transports } = require('winston');
const path = require('path');

const env = process.env.NODE_ENV;
const silent = process.env.WINSTON_QUIET ? true : false;

const logger = createLogger({
  level: env !== 'production' ? 'silly' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { app: 'bookme' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `bookme-combined.log`.
    // - Write all logs error (and below) to `bookme-error.log`.
    //
    new transports.File({
      filename: path.join('logs', 'bookme-error.log'),
      level: 'error'
    }),
    new transports.File({ filename: path.join('logs', 'bookme-combined.log') })
  ],
  silent
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (env !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

module.exports = logger;
