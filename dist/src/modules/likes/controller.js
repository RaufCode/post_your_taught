import { asyncHandler } from "../../utils/asyncHandler.ts";
import { likesService } from "./service.ts";
export class LikesController {
    toggleLike = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { postId } = req.params;
        const result = await likesService.toggleLike(userId, postId);
        res.status(200).json({
            success: true,
            data: result,
        });
    });
}
export const likesController = new LikesController();
//# sourceMappingURL=controller.js.map