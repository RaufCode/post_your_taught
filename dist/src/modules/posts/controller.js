import { asyncHandler } from "../../utils/asyncHandler.js";
import { postsService } from "./service.js";
export class PostsController {
    createPost = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const data = req.body;
        const images = req.files;
        const post = await postsService.createPost(userId, data, images);
        res.status(201).json({
            success: true,
            data: post,
        });
    });
    getAllPosts = asyncHandler(async (req, res) => {
        const query = req.validatedQuery;
        const posts = await postsService.getAllPosts(query);
        res.status(200).json({
            success: true,
            ...posts,
        });
    });
    getPostById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const viewerId = req.user?.userId;
        const post = await postsService.getPostById(id, viewerId);
        res.status(200).json({
            success: true,
            data: post,
        });
    });
    updatePost = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { id } = req.params;
        const data = req.body;
        const images = req.files;
        const post = await postsService.updatePost(id, userId, data, images);
        res.status(200).json({
            success: true,
            data: post,
        });
    });
    deletePost = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { id } = req.params;
        const result = await postsService.deletePost(id, userId);
        res.status(200).json({
            success: true,
            data: result,
        });
    });
}
export const postsController = new PostsController();
//# sourceMappingURL=controller.js.map