import { z } from "zod";

export const postIdParamSchema = z.object({
  postId: z.string().uuid("Invalid post ID"),
});

export type PostIdParam = z.infer<typeof postIdParamSchema>;
