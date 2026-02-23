export class AppError extends Error {
    statusCode;
    isOperational;
    code;
    constructor(message, statusCode = 500, code = "INTERNAL_ERROR", isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Common error types
export const BadRequestError = (message, code) => new AppError(message, 400, code || "BAD_REQUEST");
export const UnauthorizedError = (message = "Unauthorized", code) => new AppError(message, 401, code || "UNAUTHORIZED");
export const ForbiddenError = (message = "Forbidden", code) => new AppError(message, 403, code || "FORBIDDEN");
export const NotFoundError = (message, code) => new AppError(message, 404, code || "NOT_FOUND");
export const ConflictError = (message, code) => new AppError(message, 409, code || "CONFLICT");
export const ValidationError = (message, code) => new AppError(message, 422, code || "VALIDATION_ERROR");
export const TooManyRequestsError = (message = "Too many requests", code) => new AppError(message, 429, code || "TOO_MANY_REQUESTS");
//# sourceMappingURL=AppError.js.map