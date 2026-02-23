import { z } from "zod";
export const createCommentSchema = z.object({
    content: z
        .string()
        .min(1, "Comment content is required")
        .max(1000, "Comment must be at most 1000 characters"),
});
export const commentIdParamSchema = z.object({
    id: z.string().uuid("Invalid comment ID"),
});
export const postIdParamSchema = z.object({
    postId: z.string().uuid("Invalid post ID"),
});
export const paginationQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val >= 1, "Page must be at least 1"),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val >= 1 && val <= 100, "Limit must be between 1 and 100"),
});
//# sourceMappingURL=schema.js.map