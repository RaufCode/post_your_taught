import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { likesService } from "./service.ts";
import type { PostIdParam } from "./schema.ts";

export class LikesController {
  toggleLike: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { postId } = req.params as PostIdParam;

    const result = await likesService.toggleLike(userId, postId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export const likesController = new LikesController();
