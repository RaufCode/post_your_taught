import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.mts";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const post = await prisma.post.create({
      data: { title, content, authorId: userId },
      include: { author: {
        select: {
            id: true,
            first_name: true,
            last_name: true,
            user_name: true,
            email: true,
            role: true,
            created_at: true
        } } },
    });
      
      

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: {
        select: {
            id: true,
            first_name: true,
            last_name: true,
            user_name: true,
            email: true,
            role: true,
            created_at: true
        } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ count: posts.length, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: {
        select: {
            id: true,
            first_name: true,
            last_name: true,
            user_name: true,
            email: true,
            role: true,
            created_at: true
        } } },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== userId) return res.status(403).json({ message: "Forbidden" });

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content },
      include: { author: true },
    });

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== userId) return res.status(403).json({ message: "Forbidden" });

    await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
