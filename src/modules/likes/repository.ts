import { prisma } from "../../config/database.js";
import type { Like } from "@prisma/client";

export class LikesRepository {
  async findLikeByUserAndPost(
    userId: string,
    postId: string
  ): Promise<Like | null> {
    return prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
  }

  async createLike(data: {
    userId: string;
    postId: string;
  }): Promise<Like> {
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

  async deleteLike(id: string): Promise<void> {
    await prisma.like.delete({
      where: { id },
    });
  }

  async getLikesCountByPostId(postId: string): Promise<number> {
    return prisma.like.count({
      where: { postId },
    });
  }
}

export const likesRepository = new LikesRepository();
