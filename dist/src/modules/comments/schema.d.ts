import { z } from "zod";
export declare const createCommentSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const commentIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const postIdParamSchema: z.ZodObject<{
    postId: z.ZodString;
}, z.core.$strip>;
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
}, z.core.$strip>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CommentIdParam = z.infer<typeof commentIdParamSchema>;
export type PostIdParam = z.infer<typeof postIdParamSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
//# sourceMappingURL=schema.d.ts.map