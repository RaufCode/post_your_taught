import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { commentsService } from "./service.ts";
import type { CreateCommentInput, PaginationQuery, PostIdParam, CommentIdParam } from "./schema.ts";

export class CommentsController {
  createComment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { postId } = req.params as PostIdParam;
    const data = req.body as CreateCommentInput;

    const comment = await commentsService.createComment(userId, postId, data);

    res.status(201).json({
      success: true,
      data: comment,
    });
  });

  getCommentsByPost: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params as PostIdParam;
    const query = req.validatedQuery as unknown as PaginationQuery;

    const comments = await commentsService.getCommentsByPostId(postId, query);

    res.status(200).json({
      success: true,
      ...comments,
    });
  });

  deleteComment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params as CommentIdParam;

    const result = await commentsService.deleteComment(id, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export const commentsController = new CommentsController();
