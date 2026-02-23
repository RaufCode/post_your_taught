import { prisma } from "../../config/database.ts";
export class CommentsRepository {
    async createComment(data) {
        return prisma.comment.create({
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
                    },
                },
            },
        });
    }
    async findCommentById(id) {
        return prisma.comment.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
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
    async getCommentsByPostId(postId, skip, take) {
        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where: { postId },
                orderBy: { createdAt: "desc" },
                skip,
                take,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            profileImage: true,
                        },
                    },
                },
            }),
            prisma.comment.count({
                where: { postId },
            }),
        ]);
        return { comments, total };
    }
    async deleteComment(id) {
        await prisma.comment.delete({
            where: { id },
        });
    }
    async isCommentOwner(commentId, userId) {
        const comment = await prisma.comment.findFirst({
            where: {
                id: commentId,
                authorId: userId,
            },
        });
        return !!comment;
    }
}
export const commentsRepository = new CommentsRepository();
//# sourceMappingURL=repository.js.map