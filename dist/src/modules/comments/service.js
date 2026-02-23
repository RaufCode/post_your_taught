import { NotFoundError, ForbiddenError } from "../../utils/AppError.ts";
import { commentsRepository } from "./repository.ts";
import { postsRepository } from "../posts/repository.ts";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.ts";
import { logger } from "../../config/logger.ts";
import { notificationsService } from "../notifications/service.ts";
export class CommentsService {
    async createComment(authorId, postId, data) {
        // Check if post exists
        const post = await postsRepository.findPostById(postId);
        if (!post) {
            throw NotFoundError("Post not found");
        }
        // Create comment
        const comment = await commentsRepository.createComment({
            content: data.content,
            authorId,
            postId,
        });
        // Create notification for post author
        await notificationsService.createCommentNotification(authorId, post.authorId, postId, comment.id);
        logger.info({
            message: "Comment created",
            commentId: comment.id,
            postId,
            authorId,
        });
        return {
            id: comment.id,
            content: comment.content,
            author: comment.author,
            createdAt: comment.createdAt,
        };
    }
    async getCommentsByPostId(postId, query) {
        // Check if post exists
        const post = await postsRepository.findPostById(postId);
        if (!post) {
            throw NotFoundError("Post not found");
        }
        const { skip, take, page, limit } = getPaginationParams(query);
        const { comments, total } = await commentsRepository.getCommentsByPostId(postId, skip, take);
        const formattedComments = comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            author: comment.author,
            createdAt: comment.createdAt,
        }));
        return createPaginatedResponse(formattedComments, total, page, limit);
    }
    async deleteComment(commentId, userId) {
        // Check if comment exists
        const comment = await commentsRepository.findCommentById(commentId);
        if (!comment) {
            throw NotFoundError("Comment not found");
        }
        // Check if user is the comment owner
        const isOwner = await commentsRepository.isCommentOwner(commentId, userId);
        if (!isOwner) {
            throw ForbiddenError("You can only delete your own comments");
        }
        await commentsRepository.deleteComment(commentId);
        logger.info({
            message: "Comment deleted",
            commentId,
            userId,
        });
        return { message: "Comment deleted successfully" };
    }
}
export const commentsService = new CommentsService();
//# sourceMappingURL=service.js.map