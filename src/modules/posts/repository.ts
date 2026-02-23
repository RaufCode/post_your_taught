import { prisma } from "../../config/database.ts";
import type { Post, Prisma } from "@prisma/client";

export class PostsRepository {
  async createPost(data: {
    title: string;
    content: string;
    images: string[];
    authorId: string;
  }): Promise<Post> {
    return prisma.post.create({
      data,
    });
  }

  async findPostById(id: string): Promise<Post | null> {
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

  async findPostByIdWithDetails(id: string): Promise<Post | null> {
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

  async getAllPosts(
    skip: number,
    take: number
  ): Promise<{ posts: Post[]; total: number }> {
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

  async updatePost(
    id: string,
    data: Prisma.PostUpdateInput
  ): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: string): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  async isPostOwner(postId: string, userId: string): Promise<boolean> {
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
