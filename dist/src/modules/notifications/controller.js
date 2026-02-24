import { asyncHandler } from "../../utils/asyncHandler.js";
import { notificationsService } from "./service.js";
export class NotificationsController {
    getMyNotifications = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const query = req.validatedQuery;
        const notifications = await notificationsService.getNotificationsByRecipientId(userId, query);
        res.status(200).json({
            success: true,
            ...notifications,
        });
    });
    getUnreadCount = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const count = await notificationsService.getUnreadCount(userId);
        res.status(200).json({
            success: true,
            data: { unreadCount: count },
        });
    });
    markAsRead = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { id } = req.params;
        const notification = await notificationsService.markAsRead(id, userId);
        res.status(200).json({
            success: true,
            data: notification,
        });
    });
    markAllAsRead = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        await notificationsService.markAllAsRead(userId);
        res.status(200).json({
            success: true,
            data: { message: "All notifications marked as read" },
        });
    });
}
export const notificationsController = new NotificationsController();
//# sourceMappingURL=controller.js.map