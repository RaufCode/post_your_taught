import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { usersService } from "./service.ts";
import type { UpdateProfileInput, PaginationQuery } from "./schema.ts";

export class UsersController {
  getMe: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await usersService.getProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  });

  updateMe: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const data = req.body as UpdateProfileInput;
    const profileImage = req.file;

    const updatedProfile = await usersService.updateProfile(userId, data, profileImage);

    res.status(200).json({
      success: true,
      data: updatedProfile,
    });
  });

  getMyPosts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const query = req.validatedQuery as unknown as PaginationQuery;

    const posts = await usersService.getMyPosts(userId, query);

    res.status(200).json({
      success: true,
      ...posts,
    });
  });

  getMyNotifications: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const query = req.validatedQuery as unknown as PaginationQuery;
    const unreadOnly = req.validatedQuery?.unread === "true";

    const notifications = await usersService.getMyNotifications(userId, query, unreadOnly);

    res.status(200).json({
      success: true,
      ...notifications,
    });
  });

  markNotificationAsRead: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const notificationId = req.params.id as string;

    const result = await usersService.markNotificationAsRead(notificationId, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  markAllNotificationsAsRead: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const result = await usersService.markAllNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export const usersController = new UsersController();
