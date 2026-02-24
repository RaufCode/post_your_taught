import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { postsService } from "./service.js";
import type { CreatePostInput, UpdatePostInput, PaginationQuery, PostIdParam } from "./schema.js";

export class PostsController {
  createPost: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const data = req.body as CreatePostInput;
    const images = req.files as Express.Multer.File[] | undefined;

    const post = await postsService.createPost(userId, data, images);

    res.status(201).json({
      success: true,
      data: post,
    });
  });

  getAllPosts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const query = req.validatedQuery as unknown as PaginationQuery;

    const posts = await postsService.getAllPosts(query);

    res.status(200).json({
      success: true,
      ...posts,
    });
  });

  getPostById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as PostIdParam;
    const viewerId = req.user?.userId;

    const post = await postsService.getPostById(id, viewerId);

    res.status(200).json({
      success: true,
      data: post,
    });
  });

  updatePost: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params as PostIdParam;
    const data = req.body as UpdatePostInput;
    const images = req.files as Express.Multer.File[] | undefined;

    const post = await postsService.updatePost(id, userId, data, images);

    res.status(200).json({
      success: true,
      data: post,
    });
  });

  deletePost: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params as PostIdParam;

    const result = await postsService.deletePost(id, userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export const postsController = new PostsController();
