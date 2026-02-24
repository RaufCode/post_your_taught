import { prisma } from "../../config/database.js";
import type { Comment } from "@prisma/client";

export class CommentsRepository {
  async createComment(data: {
    content: string;
    authorId: string;
    postId: string;
  }): Promise<Comment> {
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

  async findCommentById(id: string): Promise<Comment | null> {
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

  async getCommentsByPostId(
    postId: string,
    skip: number,
    take: number
  ): Promise<{ comments: Comment[]; total: number }> {
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

  async deleteComment(id: string): Promise<void> {
    await prisma.comment.delete({
      where: { id },
    });
  }

  async isCommentOwner(commentId: string, userId: string): Promise<boolean> {
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
