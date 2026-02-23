import { ConflictError, NotFoundError } from "../../utils/AppError.ts";
import { usersRepository } from "./repository.ts";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.ts";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.ts";
import { logger } from "../../config/logger.ts";
export class UsersService {
    async getProfile(userId) {
        const user = await usersRepository.findUserById(userId);
        if (!user) {
            throw NotFoundError("User not found");
        }
        // Get unread notifications count
        const unreadCount = await usersRepository.getUnreadNotificationsCount(userId);
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            unreadNotifications: unreadCount,
        };
    }
    async updateProfile(userId, data, profileImage) {
        // Check if username is being changed and if it's already taken
        if (data.username) {
            const existingUser = await usersRepository.findUserByUsername(data.username);
            if (existingUser && existingUser.id !== userId) {
                throw ConflictError("Username already taken");
            }
        }
        let profileImageUrl;
        // Upload profile image if provided
        if (profileImage) {
            const uploadResult = await uploadToCloudinary(profileImage.path, "profiles");
            profileImageUrl = uploadResult.url;
            // Delete old profile image if exists
            const currentUser = await usersRepository.findUserById(userId);
            if (currentUser?.profileImage) {
                const publicId = this.extractPublicIdFromUrl(currentUser.profileImage);
                if (publicId) {
                    await deleteFromCloudinary(publicId);
                }
            }
        }
        const updateData = {};
        if (data.username)
            updateData.username = data.username;
        if (profileImageUrl)
            updateData.profileImage = profileImageUrl;
        const updatedUser = await usersRepository.updateUser(userId, updateData);
        logger.info({ message: "User profile updated", userId });
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            profileImage: updatedUser.profileImage,
            updatedAt: updatedUser.updatedAt,
        };
    }
    async getMyPosts(userId, query) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const { posts, total } = await usersRepository.getUserPosts(userId, skip, take);
        const formattedPosts = posts.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content.substring(0, 200), // Preview
            images: post.images,
            viewCount: post.viewCount,
            commentCount: post._count.comments,
            likeCount: post._count.likes,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));
        return createPaginatedResponse(formattedPosts, total, page, limit);
    }
    async getMyNotifications(userId, query, unreadOnly) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const { notifications, total } = await usersRepository.getUserNotifications(userId, skip, take, unreadOnly);
        const formattedNotifications = notifications.map((notification) => ({
            id: notification.id,
            type: notification.type,
            isRead: notification.isRead,
            actor: notification.actor,
            post: notification.post,
            createdAt: notification.createdAt,
        }));
        return createPaginatedResponse(formattedNotifications, total, page, limit);
    }
    async markNotificationAsRead(notificationId, userId) {
        const notification = await usersRepository.markNotificationAsRead(notificationId, userId);
        if (!notification) {
            throw NotFoundError("Notification not found");
        }
        return { message: "Notification marked as read" };
    }
    async markAllNotificationsAsRead(userId) {
        await usersRepository.markAllNotificationsAsRead(userId);
        return { message: "All notifications marked as read" };
    }
    extractPublicIdFromUrl(url) {
        try {
            // Extract public ID from Cloudinary URL
            // Format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{publicId}.{ext}
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
export const usersService = new UsersService();
//# sourceMappingURL=service.js.map