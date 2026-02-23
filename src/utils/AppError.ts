export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
export const BadRequestError = (message: string, code?: string) =>
  new AppError(message, 400, code || "BAD_REQUEST");

export const UnauthorizedError = (message: string = "Unauthorized", code?: string) =>
  new AppError(message, 401, code || "UNAUTHORIZED");

export const ForbiddenError = (message: string = "Forbidden", code?: string) =>
  new AppError(message, 403, code || "FORBIDDEN");

export const NotFoundError = (message: string, code?: string) =>
  new AppError(message, 404, code || "NOT_FOUND");

export const ConflictError = (message: string, code?: string) =>
  new AppError(message, 409, code || "CONFLICT");

export const ValidationError = (message: string, code?: string) =>
  new AppError(message, 422, code || "VALIDATION_ERROR");

export const TooManyRequestsError = (message: string = "Too many requests", code?: string) =>
  new AppError(message, 429, code || "TOO_MANY_REQUESTS");
