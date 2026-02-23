export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
    take: number;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export declare const getPaginationParams: (query: {
    page: number;
    limit: number;
}) => PaginationParams;
export declare const createPaginatedResponse: <T>(data: T[], total: number, page: number, limit: number) => PaginatedResult<T>;
//# sourceMappingURL=pagination.d.ts.map