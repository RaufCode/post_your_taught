import type { Request, Response, NextFunction, RequestHandler } from "express";
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
/**
 * Wraps async route handlers to catch errors and pass them to next()
 */
export declare const asyncHandler: (fn: AsyncRequestHandler) => RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map