import { NotFoundError, ForbiddenError } from "../../utils/AppError.js";
import { postsRepository } from "./repository.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.js";
import { logger } from "../../config/logger.js";
import { notificationsService } from "../notifications/service.js";
export class PostsService {
    async createPost(authorId, data, images) {
        // Upload images to Cloudinary if provided
        const imageUrls = [];
        if (images && images.length > 0) {
            for (const image of images) {
                const result = await uploadToCloudinary(image.path, "posts");
                imageUrls.push(result.url);
            }
        }
        const post = await postsRepository.createPost({
            title: data.title,
            content: data.content,
            images: imageUrls,
            authorId,
        });
        logger.info({ message: "Post created", postId: post.id, authorId });
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            images: post.images,
            viewCount: post.viewCount,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
    async getAllPosts(query) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const { posts, total } = await postsRepository.getAllPosts(skip, take);
        const formattedPosts = posts.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content.substring(0, 300), // Preview
            images: post.images,
            viewCount: post.viewCount,
            commentCount: post._count.comments,
            likeCount: post._count.likes,
            author: post.author,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));
        return createPaginatedResponse(formattedPosts, total, page, limit);
    }
    async getPostById(id, viewerId) {
        const post = await postsRepository.findPostByIdWithDetails(id);
        if (!post) {
            throw NotFoundError("Post not found");
        }
        // Increment view count
        await postsRepository.incrementViewCount(id);
        // Create view notification if viewer is not the author
        if (viewerId && viewerId !== post.authorId) {
            await notificationsService.createViewNotification(viewerId, post.authorId, post.id);
        }
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            images: post.images,
            viewCount: post.viewCount + 1, // Include the current view
            commentCount: post._count.comments,
            likeCount: post._count.likes,
            author: post.author,
            comments: post.comments,
            likes: post.likes,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
    }
    async updatePost(postId, userId, data, images) {
        // Check if post exists and user is the owner
        const isOwner = await postsRepository.isPostOwner(postId, userId);
        if (!isOwner) {
            throw ForbiddenError("You can only edit your own posts");
        }
        const post = await postsRepository.findPostById(postId);
        if (!post) {
            throw NotFoundError("Post not found");
        }
        // Upload new images if provided
        let imageUrls;
        if (images && images.length > 0) {
            imageUrls = [];
            for (const image of images) {
                const result = await uploadToCloudinary(image.path, "posts");
                imageUrls.push(result.url);
            }
            // Delete old images
            for (const oldImageUrl of post.images) {
                const publicId = this.extractPublicIdFromUrl(oldImageUrl);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            }
        }
        const updateData = {};
        if (data.title)
            updateData.title = data.title;
        if (data.content)
            updateData.content = data.content;
        if (imageUrls)
            updateData.images = imageUrls;
        const updatedPost = await postsRepository.updatePost(postId, updateData);
        logger.info({ message: "Post updated", postId, userId });
        return {
            id: updatedPost.id,
            title: updatedPost.title,
            content: updatedPost.content,
            images: updatedPost.images,
            viewCount: updatedPost.viewCount,
            updatedAt: updatedPost.updatedAt,
        };
    }
    async deletePost(postId, userId) {
        // Check if post exists and user is the owner
        const isOwner = await postsRepository.isPostOwner(postId, userId);
        if (!isOwner) {
            throw ForbiddenError("You can only delete your own posts");
        }
        const post = await postsRepository.findPostById(postId);
        if (!post) {
            throw NotFoundError("Post not found");
        }
        // Delete images from Cloudinary
        for (const imageUrl of post.images) {
            const publicId = this.extractPublicIdFromUrl(imageUrl);
            if (publicId) {
                await deleteFromCloudinary(publicId);
            }
        }
        await postsRepository.deletePost(postId);
        logger.info({ message: "Post deleted", postId, userId });
        return { message: "Post deleted successfully" };
    }
    extractPublicIdFromUrl(url) {
        try {
            const matches = url.match(/\/([^/]+)\/([^/]+)\.[^.]+$/);
            if (matches) {
                return `${matches[1]}/${matches[2]}`;
            }
            return null;
        }
        catch {
            return null;
        }
    }
}
export const postsService = new PostsService();
//# sourceMappingURL=service.js.map