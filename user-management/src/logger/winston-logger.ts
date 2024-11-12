import * as moment from 'moment';
import { AppConfig } from 'src/config/app.config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import 'winston/lib/winston/config';

const { combine, printf } = winston.format;

const customLevels = {
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',
  },
};

const colorizer = winston.format.colorize({ all: true });

const customLogFormat = printf(({ level, message, timestamp }) =>
  colorizer.colorize(
    level,
    `[${timestamp}] ${level.toLocaleUpperCase()}: ${message}`,
  ),
);

const customTimestamp = winston.format((info) => {
  info.timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

  return info;
});

const winstonLogger = {
  levels: customLevels.levels,
  format: combine(customTimestamp(), customLogFormat),
  transports: [
    new winston.transports.DailyRotateFile({
      level: AppConfig.APP_LOG_FILE_LEVEL,
      dirname: 'logs',
      filename: `${AppConfig.APP_NAME.toLowerCase()}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '500d',
      zippedArchive: true,
      maxSize: '75m',
    }),

    new winston.transports.Console({ level: 'debug' }),
  ],
};

export const winstonLoggerInstance = winston.createLogger(winstonLogger);
