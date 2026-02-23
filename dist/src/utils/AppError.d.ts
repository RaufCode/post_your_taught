export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly code: string;
    constructor(message: string, statusCode?: number, code?: string, isOperational?: boolean);
}
export declare const BadRequestError: (message: string, code?: string) => AppError;
export declare const UnauthorizedError: (message?: string, code?: string) => AppError;
export declare const ForbiddenError: (message?: string, code?: string) => AppError;
export declare const NotFoundError: (message: string, code?: string) => AppError;
export declare const ConflictError: (message: string, code?: string) => AppError;
export declare const ValidationError: (message: string, code?: string) => AppError;
export declare const TooManyRequestsError: (message?: string, code?: string) => AppError;
//# sourceMappingURL=AppError.d.ts.map