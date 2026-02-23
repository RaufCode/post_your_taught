import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
export declare const validateBody: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateParams: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validate: (schemas: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map