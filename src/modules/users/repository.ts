import { prisma } from "../../config/database.ts";
import type { User, Post, Notification } from "@prisma/client";

export class UsersRepository {
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async updateUser(
    id: string,
    data: {
      username?: string;
      profileImage?: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserPosts(
    userId: string,
    skip: number,
    take: number
  ): Promise<{ posts: Post[]; total: number }> {
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

  async getUserNotifications(
    userId: string,
    skip: number,
    take: number,
    unreadOnly?: boolean
  ): Promise<{ notifications: Notification[]; total: number }> {
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

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<Notification | null> {
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

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        recipientId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false,
      },
    });
  }
}

export const usersRepository = new UsersRepository();
