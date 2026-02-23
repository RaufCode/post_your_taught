import type { Post, Prisma } from "@prisma/client";
export declare class PostsRepository {
    createPost(data: {
        title: string;
        content: string;
        images: string[];
        authorId: string;
    }): Promise<Post>;
    findPostById(id: string): Promise<Post | null>;
    findPostByIdWithDetails(id: string): Promise<Post | null>;
    getAllPosts(skip: number, take: number): Promise<{
        posts: Post[];
        total: number;
    }>;
    updatePost(id: string, data: Prisma.PostUpdateInput): Promise<Post>;
    deletePost(id: string): Promise<void>;
    incrementViewCount(id: string): Promise<void>;
    isPostOwner(postId: string, userId: string): Promise<boolean>;
}
export declare const postsRepository: PostsRepository;
//# sourceMappingURL=repository.d.ts.map