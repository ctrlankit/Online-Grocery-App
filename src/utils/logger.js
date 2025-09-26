import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";

const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(
    meta
  )}`;
});

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    logFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join("src", "storage", "logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new transports.Console(),
  ],
});

export const logError = (file, method, error) => {
  logger.error(error.message || "Unhandled error", {
    file,
    method,
    stack: error.stack,
  });
};

export default logger;
