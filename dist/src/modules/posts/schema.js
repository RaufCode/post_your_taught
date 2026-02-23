import { z } from "zod";
export const createPostSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be at most 200 characters"),
    content: z.string().min(1, "Content is required"),
});
export const updatePostSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be at most 200 characters")
        .optional(),
    content: z.string().min(1, "Content is required").optional(),
});
export const postIdParamSchema = z.object({
    id: z.string().uuid("Invalid post ID"),
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