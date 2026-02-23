import type { RequestHandler } from "express";
export declare class UsersController {
    getMe: RequestHandler;
    updateMe: RequestHandler;
    getMyPosts: RequestHandler;
    getMyNotifications: RequestHandler;
    markNotificationAsRead: RequestHandler;
    markAllNotificationsAsRead: RequestHandler;
}
export declare const usersController: UsersController;
//# sourceMappingURL=controller.d.ts.map