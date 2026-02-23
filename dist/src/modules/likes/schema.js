import { z } from "zod";
export const postIdParamSchema = z.object({
    postId: z.string().uuid("Invalid post ID"),
});
//# sourceMappingURL=schema.js.map