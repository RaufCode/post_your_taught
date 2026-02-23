export const getPaginationParams = (query) => {
    const parsedPage = Math.max(1, query.page || 1);
    const parsedLimit = Math.min(100, Math.max(1, query.limit || 10));
    return {
        page: parsedPage,
        limit: parsedLimit,
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
    };
};
export const createPaginatedResponse = (data, total, page, limit) => ({
    data,
    meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    },
});
//# sourceMappingURL=pagination.js.map