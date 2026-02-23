import type { PaginationQuery } from "./schema.ts";
export declare class NotificationsService {
    createCommentNotification(actorId: string, recipientId: string, postId: string, commentId: string): Promise<void>;
    createLikeNotification(actorId: string, recipientId: string, postId: string, likeId: string): Promise<void>;
    createViewNotification(actorId: string, recipientId: string, postId: string): Promise<void>;
    getNotificationsByRecipientId(recipientId: string, query: PaginationQuery): Promise<import("../../utils/pagination.ts").PaginatedResult<{
        id: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        createdAt: Date;
        actor: {
            id: string;
            username: string;
            profileImage: string | null;
        };
        post: {
            id: string;
            title: string;
        } | null;
        comment: {
            id: string;
            content: string;
        } | null;
    }>>;
    getUnreadCount(recipientId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<{
        id: string | undefined;
        type: import("@prisma/client").$Enums.NotificationType | undefined;
        isRead: boolean;
        actor: {
            id: string;
            username: string;
            profileImage: string | null;
        };
        post: {
            id: string;
            title: string;
        } | null;
    }>;
    markAllAsRead(recipientId: string): Promise<void>;
}
export declare const notificationsService: NotificationsService;
//# sourceMappingURL=service.d.ts.map