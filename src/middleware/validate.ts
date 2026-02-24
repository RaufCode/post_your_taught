import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import { BadRequestError } from "../utils/AppError.js";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const error = new ZodError(result.error.issues);
        throw error;
      }

      // Replace body with parsed data (includes transformations)
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const error = new ZodError(result.error.issues);
        throw error;
      }

      req.params = result.data as Request["params"];
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const error = new ZodError(result.error.issues);
        throw error;
      }

      req.validatedQuery = result.data as Record<string, unknown>;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Combined validation for multiple sources
export const validate = (schemas: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        const bodyResult = schemas.body.safeParse(req.body);
        if (!bodyResult.success) {
          throw new ZodError(bodyResult.error.issues);
        }
        req.body = bodyResult.data;
      }

      if (schemas.params) {
        const paramsResult = schemas.params.safeParse(req.params);
        if (!paramsResult.success) {
          throw new ZodError(paramsResult.error.issues);
        }
        req.params = paramsResult.data as Request["params"];
      }

      if (schemas.query) {
        const queryResult = schemas.query.safeParse(req.query);
        if (!queryResult.success) {
          throw new ZodError(queryResult.error.issues);
        }
        req.validatedQuery = queryResult.data as Record<string, unknown>;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
