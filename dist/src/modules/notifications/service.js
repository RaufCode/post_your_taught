import { prisma } from "../../config/database.js";
import { notificationsRepository } from "./repository.js";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.js";
import { NotFoundError, ForbiddenError } from "../../utils/AppError.js";
import { logger } from "../../config/logger.js";
export class NotificationsService {
    // Notification creation methods (called by other services)
    async createCommentNotification(actorId, recipientId, postId, commentId) {
        if (actorId === recipientId)
            return;
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
        }
        catch (error) {
            logger.error({
                message: "Failed to create comment notification",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async createLikeNotification(actorId, recipientId, postId, likeId) {
        if (actorId === recipientId)
            return;
        try {
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    type: "LIKE",
                    actorId,
                    recipientId,
                    postId,
                },
            });
            if (existingNotification)
                return;
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
        }
        catch (error) {
            logger.error({
                message: "Failed to create like notification",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async createViewNotification(actorId, recipientId, postId) {
        if (actorId === recipientId)
            return;
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
        }
        catch (error) {
            logger.error({
                message: "Failed to create view notification",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // User-facing methods
    async getNotificationsByRecipientId(recipientId, query) {
        const { skip, take, page, limit } = getPaginationParams(query);
        const { notifications, total } = await notificationsRepository.getNotificationsByRecipientId(recipientId, skip, take);
        const formattedNotifications = notifications.map((notification) => ({
            id: notification.id,
            type: notification.type,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
            actor: notification.actor,
            post: notification.post,
            comment: notification.comment,
        }));
        return createPaginatedResponse(formattedNotifications, total, page, limit);
    }
    async getUnreadCount(recipientId) {
        return notificationsRepository.getUnreadCount(recipientId);
    }
    async markAsRead(notificationId, userId) {
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
            actor: updated.actor,
            post: updated.post,
        };
    }
    async markAllAsRead(recipientId) {
        await notificationsRepository.markAllAsRead(recipientId);
        logger.info({
            message: "All notifications marked as read",
            recipientId,
        });
    }
}
export const notificationsService = new NotificationsService();
//# sourceMappingURL=service.js.map