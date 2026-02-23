import { prisma } from "../../config/database.ts";
import type { Notification } from "@prisma/client";

export class NotificationsRepository {
  async getNotificationsByRecipientId(
    recipientId: string,
    skip: number,
    take: number
  ): Promise<{ notifications: Notification[]; total: number }> {
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

  async getUnreadCount(recipientId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        recipientId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string, recipientId: string): Promise<Notification | null> {
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

  async markAllAsRead(recipientId: string): Promise<void> {
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

  async findNotificationById(id: string): Promise<Notification | null> {
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

  async isNotificationOwner(notificationId: string, userId: string): Promise<boolean> {
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
