import { prisma } from "../../config/database.js";
export class UsersRepository {
    async findUserById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async findUserByUsername(username) {
        return prisma.user.findUnique({
            where: { username },
        });
    }
    async updateUser(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    async getUserPosts(userId, skip, take) {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: { authorId: userId },
                orderBy: { createdAt: "desc" },
                skip,
                take,
                include: {
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                        },
                    },
                },
            }),
            prisma.post.count({
                where: { authorId: userId },
            }),
        ]);
        return { posts, total };
    }
    async getUserNotifications(userId, skip, take, unreadOnly) {
        const where = {
            recipientId: userId,
            ...(unreadOnly && { isRead: false }),
        };
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
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
                },
            }),
            prisma.notification.count({ where }),
        ]);
        return { notifications, total };
    }
    async markNotificationAsRead(notificationId, userId) {
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                recipientId: userId,
            },
        });
        if (!notification) {
            return null;
        }
        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    async markAllNotificationsAsRead(userId) {
        await prisma.notification.updateMany({
            where: {
                recipientId: userId,
                isRead: false,
            },
            data: { isRead: true },
        });
    }
    async getUnreadNotificationsCount(userId) {
        return prisma.notification.count({
            where: {
                recipientId: userId,
                isRead: false,
            },
        });
    }
}
export const usersRepository = new UsersRepository();
//# sourceMappingURL=repository.js.map