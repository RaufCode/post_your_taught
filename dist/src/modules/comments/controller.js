import { asyncHandler } from "../../utils/asyncHandler.ts";
import { commentsService } from "./service.ts";
export class CommentsController {
    createComment = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { postId } = req.params;
        const data = req.body;
        const comment = await commentsService.createComment(userId, postId, data);
        res.status(201).json({
            success: true,
            data: comment,
        });
    });
    getCommentsByPost = asyncHandler(async (req, res) => {
        const { postId } = req.params;
        const query = req.validatedQuery;
        const comments = await commentsService.getCommentsByPostId(postId, query);
        res.status(200).json({
            success: true,
            ...comments,
        });
    });
    deleteComment = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { id } = req.params;
        const result = await commentsService.deleteComment(id, userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    });
}
export const commentsController = new CommentsController();
//# sourceMappingURL=controller.js.map