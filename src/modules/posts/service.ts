import { NotFoundError, ForbiddenError } from "../../utils/AppError.ts";
import { postsRepository } from "./repository.ts";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.ts";
import type { CreatePostInput, UpdatePostInput, PaginationQuery } from "./schema.ts";
import { getPaginationParams, createPaginatedResponse } from "../../utils/pagination.ts";
import { logger } from "../../config/logger.ts";
import { notificationsService } from "../notifications/service.ts";

export class PostsService {
  async createPost(
    authorId: string,
    data: CreatePostInput,
    images?: Express.Multer.File[]
  ) {
    // Upload images to Cloudinary if provided
    const imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const result = await uploadToCloudinary(image.path, "posts");
        imageUrls.push(result.url);
      }
    }

    const post = await postsRepository.createPost({
      title: data.title,
      content: data.content,
      images: imageUrls,
      authorId,
    });

    logger.info({ message: "Post created", postId: post.id, authorId });

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      images: post.images,
      viewCount: post.viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async getAllPosts(query: PaginationQuery) {
    const { skip, take, page, limit } = getPaginationParams(query);

    const { posts, total } = await postsRepository.getAllPosts(skip, take);

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 300), // Preview
      images: post.images,
      viewCount: post.viewCount,
      commentCount: (post as unknown as { _count: { comments: number } })._count.comments,
      likeCount: (post as unknown as { _count: { likes: number } })._count.likes,
      author: (post as unknown as { author: { id: string; username: string; profileImage: string | null } }).author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return createPaginatedResponse(formattedPosts, total, page, limit);
  }

  async getPostById(id: string, viewerId?: string) {
    const post = await postsRepository.findPostByIdWithDetails(id);

    if (!post) {
      throw NotFoundError("Post not found");
    }

    // Increment view count
    await postsRepository.incrementViewCount(id);

    // Create view notification if viewer is not the author
    if (viewerId && viewerId !== post.authorId) {
      await notificationsService.createViewNotification(viewerId, post.authorId, post.id);
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      images: post.images,
      viewCount: post.viewCount + 1, // Include the current view
      commentCount: (post as unknown as { _count: { comments: number } })._count.comments,
      likeCount: (post as unknown as { _count: { likes: number } })._count.likes,
      author: (post as unknown as { author: { id: string; username: string; profileImage: string | null } }).author,
      comments: (post as unknown as { comments: Array<{ id: string; content: string; createdAt: Date; author: { id: string; username: string; profileImage: string | null } }> }).comments,
      likes: (post as unknown as { likes: Array<{ id: string; user: { id: string; username: string } }> }).likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async updatePost(
    postId: string,
    userId: string,
    data: UpdatePostInput,
    images?: Express.Multer.File[]
  ) {
    // Check if post exists and user is the owner
    const isOwner = await postsRepository.isPostOwner(postId, userId);
    if (!isOwner) {
      throw ForbiddenError("You can only edit your own posts");
    }

    const post = await postsRepository.findPostById(postId);
    if (!post) {
      throw NotFoundError("Post not found");
    }

    // Upload new images if provided
    let imageUrls: string[] | undefined;
    if (images && images.length > 0) {
      imageUrls = [];
      for (const image of images) {
        const result = await uploadToCloudinary(image.path, "posts");
        imageUrls.push(result.url);
      }

      // Delete old images
      for (const oldImageUrl of post.images) {
        const publicId = this.extractPublicIdFromUrl(oldImageUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
    }

    const updateData: { title?: string; content?: string; images?: string[] } = {};
    if (data.title) updateData.title = data.title;
    if (data.content) updateData.content = data.content;
    if (imageUrls) updateData.images = imageUrls;

    const updatedPost = await postsRepository.updatePost(postId, updateData);

    logger.info({ message: "Post updated", postId, userId });

    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      images: updatedPost.images,
      viewCount: updatedPost.viewCount,
      updatedAt: updatedPost.updatedAt,
    };
  }

  async deletePost(postId: string, userId: string) {
    // Check if post exists and user is the owner
    const isOwner = await postsRepository.isPostOwner(postId, userId);
    if (!isOwner) {
      throw ForbiddenError("You can only delete your own posts");
    }

    const post = await postsRepository.findPostById(postId);
    if (!post) {
      throw NotFoundError("Post not found");
    }

    // Delete images from Cloudinary
    for (const imageUrl of post.images) {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await postsRepository.deletePost(postId);

    logger.info({ message: "Post deleted", postId, userId });

    return { message: "Post deleted successfully" };
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/([^/]+)\/([^/]+)\.[^.]+$/);
      if (matches) {
        return `${matches[1]}/${matches[2]}`;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const postsService = new PostsService();
