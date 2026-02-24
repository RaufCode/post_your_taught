import { prisma } from "../../config/database.js";
import { notificationsRepository } from "./repository.js";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.js";
import { NotFoundError, ForbiddenError } from "../../utils/AppError.js";
import { logger } from "../../config/logger.js";
import type { PaginationQuery } from "./schema.js";

export class NotificationsService {
  // Notification creation methods (called by other services)
  async createCommentNotification(
    actorId: string,
    recipientId: string,
    postId: string,
    commentId: string
  ) {
    if (actorId === recipientId) return;

    try {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          actorId,
          recipientId,
          postId,
          commentId,
        },
      });

      logger.info({
        message: "Comment notification created",
        actorId,
        recipientId,
        postId,
      });
    } catch (error) {
      logger.error({
        message: "Failed to create comment notification",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createLikeNotification(
    actorId: string,
    recipientId: string,
    postId: string,
    likeId: string
  ) {
    if (actorId === recipientId) return;

    try {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          type: "LIKE",
          actorId,
          recipientId,
          postId,
        },
      });

      if (existingNotification) return;

      await prisma.notification.create({
        data: {
          type: "LIKE",
          actorId,
          recipientId,
          postId,
          likeId,
        },
      });

      logger.info({
        message: "Like notification created",
        actorId,
        recipientId,
        postId,
      });
    } catch (error) {
      logger.error({
        message: "Failed to create like notification",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createViewNotification(
    actorId: string,
    recipientId: string,
    postId: string
  ) {
    if (actorId === recipientId) return;

    try {
      await prisma.notification.create({
        data: {
          type: "VIEW",
          actorId,
          recipientId,
          postId,
        },
      });

      logger.debug({
        message: "View notification created",
        actorId,
        recipientId,
        postId,
      });
    } catch (error) {
      logger.error({
        message: "Failed to create view notification",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // User-facing methods
  async getNotificationsByRecipientId(recipientId: string, query: PaginationQuery) {
    const { skip, take, page, limit } = getPaginationParams(query);

    const { notifications, total } = await notificationsRepository.getNotificationsByRecipientId(
      recipientId,
      skip,
      take
    );

    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      actor: (notification as unknown as { actor: { id: string; username: string; profileImage: string | null } }).actor,
      post: (notification as unknown as { post: { id: string; title: string } | null }).post,
      comment: (notification as unknown as { comment: { id: string; content: string } | null }).comment,
    }));

    return createPaginatedResponse(formattedNotifications, total, page, limit);
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return notificationsRepository.getUnreadCount(recipientId);
  }

  async markAsRead(notificationId: string, userId: string) {
    // Check if notification exists
    const notification = await notificationsRepository.findNotificationById(notificationId);
    if (!notification) {
      throw NotFoundError("Notification not found");
    }

    // Check if user is the recipient
    const isOwner = await notificationsRepository.isNotificationOwner(notificationId, userId);
    if (!isOwner) {
      throw ForbiddenError("You can only mark your own notifications as read");
    }

    const updated = await notificationsRepository.markAsRead(notificationId, userId);

    return {
      id: updated?.id,
      type: updated?.type,
      isRead: true,
      actor: (updated as unknown as { actor: { id: string; username: string; profileImage: string | null } }).actor,
      post: (updated as unknown as { post: { id: string; title: string } | null }).post,
    };
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await notificationsRepository.markAllAsRead(recipientId);

    logger.info({
      message: "All notifications marked as read",
      recipientId,
    });
  }
}

export const notificationsService = new NotificationsService();
