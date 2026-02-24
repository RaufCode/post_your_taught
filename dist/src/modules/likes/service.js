import { NotFoundError } from "../../utils/AppError.js";
import { likesRepository } from "./repository.js";
import { postsRepository } from "../posts/repository.js";
import { logger } from "../../config/logger.js";
import { notificationsService } from "../notifications/service.js";
export class LikesService {
    async toggleLike(userId, postId) {
        // Check if post exists
        const post = await postsRepository.findPostById(postId);
        if (!post) {
            throw NotFoundError("Post not found");
        }
        // Check if user already liked the post
        const existingLike = await likesRepository.findLikeByUserAndPost(userId, postId);
        if (existingLike) {
            // Unlike - delete the existing like
            await likesRepository.deleteLike(existingLike.id);
            logger.info({
                message: "Post unliked",
                postId,
                userId,
            });
            return {
                liked: false,
                message: "Post unliked successfully",
            };
        }
        // Like - create new like
        const like = await likesRepository.createLike({
            userId,
            postId,
        });
        // Create notification for post author
        await notificationsService.createLikeNotification(userId, post.authorId, postId, like.id);
        logger.info({
            message: "Post liked",
            postId,
            userId,
        });
        return {
            liked: true,
            message: "Post liked successfully",
        };
    }
}
export const likesService = new LikesService();
//# sourceMappingURL=service.js.map