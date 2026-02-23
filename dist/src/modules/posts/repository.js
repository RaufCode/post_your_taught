import { prisma } from "../../config/database.ts";
export class PostsRepository {
    async createPost(data) {
        return prisma.post.create({
            data,
        });
    }
    async findPostById(id) {
        return prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
    }
    async findPostByIdWithDetails(id) {
        return prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true,
                    },
                },
                comments: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                profileImage: true,
                            },
                        },
                    },
                },
                likes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
    }
    async getAllPosts(skip, take) {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
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
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                        },
                    },
                },
            }),
            prisma.post.count(),
        ]);
        return { posts, total };
    }
    async updatePost(id, data) {
        return prisma.post.update({
            where: { id },
            data,
        });
    }
    async deletePost(id) {
        await prisma.post.delete({
            where: { id },
        });
    }
    async incrementViewCount(id) {
        await prisma.post.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
    }
    async isPostOwner(postId, userId) {
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                authorId: userId,
            },
        });
        return !!post;
    }
}
export const postsRepository = new PostsRepository();
//# sourceMappingURL=repository.js.map