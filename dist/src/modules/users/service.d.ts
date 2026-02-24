import type { UpdateProfileInput, PaginationQuery } from "./schema.js";
export declare class UsersService {
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        username: string;
        profileImage: string | null;
        createdAt: Date;
        unreadNotifications: number;
    }>;
    updateProfile(userId: string, data: UpdateProfileInput, profileImage?: Express.Multer.File): Promise<{
        id: string;
        email: string;
        username: string;
        profileImage: string | null;
        updatedAt: Date;
    }>;
    getMyPosts(userId: string, query: PaginationQuery): Promise<import("../../utils/pagination.js").PaginatedResult<{
        id: string;
        title: string;
        content: string;
        images: string[];
        viewCount: number;
        commentCount: number;
        likeCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    getMyNotifications(userId: string, query: PaginationQuery, unreadOnly?: boolean): Promise<import("../../utils/pagination.js").PaginatedResult<{
        id: string;
        type: import("@prisma/client").$Enums.NotificationType;
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
        createdAt: Date;
    }>>;
    markNotificationAsRead(notificationId: string, userId: string): Promise<{
        message: string;
    }>;
    markAllNotificationsAsRead(userId: string): Promise<{
        message: string;
    }>;
    private extractPublicIdFromUrl;
}
export declare const usersService: UsersService;
//# sourceMappingURL=service.d.ts.map