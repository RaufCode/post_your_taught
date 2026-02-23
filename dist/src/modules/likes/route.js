import { Router } from "express";
import { likesController } from "./controller.ts";
import { authenticate } from "../../middleware/auth.ts";
import { validateParams } from "../../middleware/validate.ts";
import { postIdParamSchema } from "./schema.ts";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management endpoints
 */
// POST /api/posts/:postId/like - Toggle like on a post
/**
 * @swagger
 * /posts/{postId}/like:
 *   post:
 *     summary: Toggle like on a post
 *     description: Like a post if not already liked, unlike if already liked
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Like toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post liked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked:
 *                       type: boolean
 *                       example: true
 *                     likeCount:
 *                       type: integer
 *                       example: 42
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post("/posts/:postId/like", authenticate, validateParams(postIdParamSchema), likesController.toggleLike);
export default router;
//# sourceMappingURL=route.js.map