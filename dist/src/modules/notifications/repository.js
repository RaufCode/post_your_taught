import { prisma } from "../../config/database.js";
export class NotificationsRepository {
    async getNotificationsByRecipientId(recipientId, skip, take) {
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { recipientId },
                orderBy: { createdAt: "desc" },
                skip,
                take,
                include: {
                    actor: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    comment: {
                        select: {
                            id: true,
                            content: true,
                        },
                    },
                },
            }),
            prisma.notification.count({
                where: { recipientId },
            }),
        ]);
        return { notifications, total };
    }
    async getUnreadCount(recipientId) {
        return prisma.notification.count({
            where: {
                recipientId,
                isRead: false,
            },
        });
    }
    async markAsRead(notificationId, recipientId) {
        return prisma.notification.updateMany({
            where: {
                id: notificationId,
                recipientId,
            },
            data: {
                isRead: true,
            },
        }).then(() => {
            return prisma.notification.findUnique({
                where: { id: notificationId },
                include: {
                    actor: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                    post: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            });
        });
    }
    async markAllAsRead(recipientId) {
        await prisma.notification.updateMany({
            where: {
                recipientId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    async findNotificationById(id) {
        return prisma.notification.findUnique({
            where: { id },
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }
    async isNotificationOwner(notificationId, userId) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                recipientId: userId,
            },
        });
        return !!notification;
    }
}
export const notificationsRepository = new NotificationsRepository();
//# sourceMappingURL=repository.js.map