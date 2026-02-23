import { prisma } from "../../config/database.ts";
export class LikesRepository {
    async findLikeByUserAndPost(userId, postId) {
        return prisma.like.findFirst({
            where: {
                userId,
                postId,
            },
        });
    }
    async createLike(data) {
        return prisma.like.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                post: {
                    select: {
                        id: true,
                        authorId: true,
                    },
                },
            },
        });
    }
    async deleteLike(id) {
        await prisma.like.delete({
            where: { id },
        });
    }
    async getLikesCountByPostId(postId) {
        return prisma.like.count({
            where: { postId },
        });
    }
}
export const likesRepository = new LikesRepository();
//# sourceMappingURL=repository.js.map