import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { notificationsService } from "./service.js";
import type { PaginationQuery, NotificationIdParam } from "./schema.js";

export class NotificationsController {
  getMyNotifications: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const query = req.validatedQuery as unknown as PaginationQuery;

    const notifications = await notificationsService.getNotificationsByRecipientId(
      userId,
      query
    );

    res.status(200).json({
      success: true,
      ...notifications,
    });
  });

  getUnreadCount: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const count = await notificationsService.getUnreadCount(userId);

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  });

  markAsRead: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params as NotificationIdParam;

    const notification = await notificationsService.markAsRead(id, userId);

    res.status(200).json({
      success: true,
      data: notification,
    });
  });

  markAllAsRead: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    await notificationsService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      data: { message: "All notifications marked as read" },
    });
  });
}

export const notificationsController = new NotificationsController();
