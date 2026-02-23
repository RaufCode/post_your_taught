import { AppError } from "../utils/AppError.ts";
import { logger } from "../config/logger.ts";
import { env } from "../config/env.ts";
import { ZodError } from "zod";
export const errorHandler = (err, req, res, _next) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((issue) => ({
            path: issue.path.map(String).join("."),
            message: issue.message,
        }));
        res.status(422).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Validation failed",
                details: formattedErrors,
            },
        });
        return;
    }
    // Handle operational errors (expected errors)
    if (err instanceof AppError) {
        if (!err.isOperational) {
            // Log unexpected operational errors
            logger.error({
                message: err.message,
                code: err.code,
                statusCode: err.statusCode,
                stack: err.stack,
                path: req.path,
                method: req.method,
            });
        }
        res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
        });
        return;
    }
    // Handle Prisma errors
    if (err.name === "PrismaClientKnownRequestError") {
        logger.error({
            message: "Database error",
            error: err.message,
            code: err.code,
            path: req.path,
            method: req.method,
        });
        // Unique constraint violation
        if (err.code === "P2002") {
            res.status(409).json({
                success: false,
                error: {
                    code: "DUPLICATE_ENTRY",
                    message: "A record with this value already exists",
                },
            });
            return;
        }
        // Foreign key constraint violation
        if (err.code === "P2003") {
            res.status(400).json({
                success: false,
                error: {
                    code: "INVALID_REFERENCE",
                    message: "Referenced record does not exist",
                },
            });
            return;
        }
        // Record not found
        if (err.code === "P2025") {
            res.status(404).json({
                success: false,
                error: {
                    code: "NOT_FOUND",
                    message: "Record not found",
                },
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: {
                code: "DATABASE_ERROR",
                message: "Database operation failed",
            },
        });
        return;
    }
    // Log unexpected errors
    logger.error({
        message: "Unexpected error",
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    // Send generic error response in production
    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_ERROR",
            message: env.NODE_ENV === "production"
                ? "Something went wrong"
                : err.message,
            ...(env.NODE_ENV === "development" && { stack: err.stack }),
        },
    });
};
//# sourceMappingURL=errorHandler.js.map