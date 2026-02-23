import type { Notification } from "@prisma/client";
export declare class NotificationsRepository {
    getNotificationsByRecipientId(recipientId: string, skip: number, take: number): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    getUnreadCount(recipientId: string): Promise<number>;
    markAsRead(notificationId: string, recipientId: string): Promise<Notification | null>;
    markAllAsRead(recipientId: string): Promise<void>;
    findNotificationById(id: string): Promise<Notification | null>;
    isNotificationOwner(notificationId: string, userId: string): Promise<boolean>;
}
export declare const notificationsRepository: NotificationsRepository;
//# sourceMappingURL=repository.d.ts.map