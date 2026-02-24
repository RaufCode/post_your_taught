import { asyncHandler } from "../../utils/asyncHandler.js";
import { usersService } from "./service.js";
export class UsersController {
    getMe = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const profile = await usersService.getProfile(userId);
        res.status(200).json({
            success: true,
            data: profile,
        });
    });
    updateMe = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const data = req.body;
        const profileImage = req.file;
        const updatedProfile = await usersService.updateProfile(userId, data, profileImage);
        res.status(200).json({
            success: true,
            data: updatedProfile,
        });
    });
    getMyPosts = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const query = req.validatedQuery;
        const posts = await usersService.getMyPosts(userId, query);
        res.status(200).json({
            success: true,
            ...posts,
        });
    });
    getMyNotifications = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const query = req.validatedQuery;
        const unreadOnly = req.validatedQuery?.unread === "true";
        const notifications = await usersService.getMyNotifications(userId, query, unreadOnly);
        res.status(200).json({
            success: true,
            ...notifications,
        });
    });
    markNotificationAsRead = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const notificationId = req.params.id;
        const result = await usersService.markNotificationAsRead(notificationId, userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    });
    markAllNotificationsAsRead = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const result = await usersService.markAllNotificationsAsRead(userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    });
}
export const usersController = new UsersController();
//# sourceMappingURL=controller.js.map