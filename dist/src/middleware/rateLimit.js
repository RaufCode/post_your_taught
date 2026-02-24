import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { TooManyRequestsError } from "../utils/AppError.js";
// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(TooManyRequestsError("Too many requests, please try again later"));
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === "/health";
    },
});
// Stricter limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(TooManyRequestsError("Too many login attempts, please try again later"));
    },
    skipSuccessfulRequests: true, // Don't count successful logins
});
//# sourceMappingURL=rateLimit.js.map