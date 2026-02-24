import winston from "winston";
import { env } from "./env.js";

const { combine, timestamp, json, errors, printf, colorize } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

// Create the logger instance
export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  defaultMeta: { service: "blog-backend" },
  transports: [
    new winston.transports.Console({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        env.NODE_ENV === "development" ? combine(colorize(), devFormat) : json()
      ),
    }),
  ],
});

// Stream for Morgan HTTP logging
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Helper functions for structured logging
export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context,
  });
};

export const logInfo = (message: string, metadata?: Record<string, unknown>) => {
  logger.info({ message, ...metadata });
};

export const logDebug = (message: string, metadata?: Record<string, unknown>) => {
  logger.debug({ message, ...metadata });
};

export const logWarn = (message: string, metadata?: Record<string, unknown>) => {
  logger.warn({ message, ...metadata });
};
