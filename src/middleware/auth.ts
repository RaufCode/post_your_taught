import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type TokenPayload } from "../utils/jwt.ts";
import { UnauthorizedError } from "../utils/AppError.ts";
import { logger } from "../config/logger.ts";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw UnauthorizedError("Access token required");
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      throw UnauthorizedError("Access token required");
    }

    const payload = verifyAccessToken(token);
    
    if (payload.type !== "access") {
      throw UnauthorizedError("Invalid token type");
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(UnauthorizedError("Invalid token"));
    } else if (error instanceof Error && error.name === "TokenExpiredError") {
      next(UnauthorizedError("Token expired"));
    } else {
      next(error);
    }
  }
};

// Optional authentication - doesn't throw if no token
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    
    if (payload.type === "access") {
      req.user = {
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
      };
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    logger.debug({ message: "Optional auth failed", error });
    next();
  }
};
