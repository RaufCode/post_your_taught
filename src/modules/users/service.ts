import { ConflictError, NotFoundError } from "../../utils/AppError.ts";
import { usersRepository } from "./repository.ts";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.ts";
import type { UpdateProfileInput, PaginationQuery } from "./schema.ts";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.ts";
import { logger } from "../../config/logger.ts";

export class UsersService {
  async getProfile(userId: string) {
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

  async updateProfile(userId: string, data: UpdateProfileInput, profileImage?: Express.Multer.File) {
    // Check if username is being changed and if it's already taken
    if (data.username) {
      const existingUser = await usersRepository.findUserByUsername(data.username);
      if (existingUser && existingUser.id !== userId) {
        throw ConflictError("Username already taken");
      }
    }

    let profileImageUrl: string | undefined;

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

    const updateData: { username?: string; profileImage?: string } = {};
    if (data.username) updateData.username = data.username;
    if (profileImageUrl) updateData.profileImage = profileImageUrl;

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

  async getMyPosts(userId: string, query: PaginationQuery) {
    const { skip, take, page, limit } = getPaginationParams(query);

    const { posts, total } = await usersRepository.getUserPosts(userId, skip, take);

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 200), // Preview
      images: post.images,
      viewCount: post.viewCount,
      commentCount: (post as unknown as { _count: { comments: number } })._count.comments,
      likeCount: (post as unknown as { _count: { likes: number } })._count.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return createPaginatedResponse(formattedPosts, total, page, limit);
  }

  async getMyNotifications(userId: string, query: PaginationQuery, unreadOnly?: boolean) {
    const { skip, take, page, limit } = getPaginationParams(query);

    const { notifications, total } = await usersRepository.getUserNotifications(
      userId,
      skip,
      take,
      unreadOnly
    );

    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      isRead: notification.isRead,
      actor: (notification as unknown as { actor: { id: string; username: string; profileImage: string | null } }).actor,
      post: (notification as unknown as { post: { id: string; title: string } | null }).post,
      createdAt: notification.createdAt,
    }));

    return createPaginatedResponse(formattedNotifications, total, page, limit);
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    const notification = await usersRepository.markNotificationAsRead(notificationId, userId);
    
    if (!notification) {
      throw NotFoundError("Notification not found");
    }

    return { message: "Notification marked as read" };
  }

  async markAllNotificationsAsRead(userId: string) {
    await usersRepository.markAllNotificationsAsRead(userId);
    return { message: "All notifications marked as read" };
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public ID from Cloudinary URL
      // Format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{publicId}.{ext}
      const matches = url.match(/\/([^/]+)\/([^/]+)\.[^.]+$/);
      if (matches) {
        return `${matches[1]}/${matches[2]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const usersService = new UsersService();
