import type { User, Post, Notification } from "@prisma/client";
export declare class UsersRepository {
    findUserById(id: string): Promise<User | null>;
    findUserByUsername(username: string): Promise<User | null>;
    updateUser(id: string, data: {
        username?: string;
        profileImage?: string;
    }): Promise<User>;
    getUserPosts(userId: string, skip: number, take: number): Promise<{
        posts: Post[];
        total: number;
    }>;
    getUserNotifications(userId: string, skip: number, take: number, unreadOnly?: boolean): Promise<{
        notifications: Notification[];
        total: number;
    }>;
    markNotificationAsRead(notificationId: string, userId: string): Promise<Notification | null>;
    markAllNotificationsAsRead(userId: string): Promise<void>;
    getUnreadNotificationsCount(userId: string): Promise<number>;
}
export declare const usersRepository: UsersRepository;
//# sourceMappingURL=repository.d.ts.map