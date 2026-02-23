import { ZodError } from "zod";
import { BadRequestError } from "../utils/AppError.ts";
export const validateBody = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                const error = new ZodError(result.error.issues);
                throw error;
            }
            // Replace body with parsed data (includes transformations)
            req.body = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export const validateParams = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse(req.params);
            if (!result.success) {
                const error = new ZodError(result.error.issues);
                throw error;
            }
            req.params = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export const validateQuery = (schema) => {
    return (req, _res, next) => {
        try {
            const result = schema.safeParse(req.query);
            if (!result.success) {
                const error = new ZodError(result.error.issues);
                throw error;
            }
            req.validatedQuery = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
// Combined validation for multiple sources
export const validate = (schemas) => {
    return (req, _res, next) => {
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
                req.params = paramsResult.data;
            }
            if (schemas.query) {
                const queryResult = schemas.query.safeParse(req.query);
                if (!queryResult.success) {
                    throw new ZodError(queryResult.error.issues);
                }
                req.validatedQuery = queryResult.data;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
//# sourceMappingURL=validate.js.map