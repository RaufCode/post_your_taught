import type { CreatePostInput, UpdatePostInput, PaginationQuery } from "./schema.js";
export declare class PostsService {
    createPost(authorId: string, data: CreatePostInput, images?: Express.Multer.File[]): Promise<{
        id: string;
        title: string;
        content: string;
        images: string[];
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllPosts(query: PaginationQuery): Promise<import("../../utils/pagination.js").PaginatedResult<{
        id: string;
        title: string;
        content: string;
        images: string[];
        viewCount: number;
        commentCount: number;
        likeCount: number;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
        };
        createdAt: Date;
        updatedAt: Date;
    }>>;
    getPostById(id: string, viewerId?: string): Promise<{
        id: string;
        title: string;
        content: string;
        images: string[];
        viewCount: number;
        commentCount: number;
        likeCount: number;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
        };
        comments: {
            id: string;
            content: string;
            createdAt: Date;
            author: {
                id: string;
                username: string;
                profileImage: string | null;
            };
        }[];
        likes: {
            id: string;
            user: {
                id: string;
                username: string;
            };
        }[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePost(postId: string, userId: string, data: UpdatePostInput, images?: Express.Multer.File[]): Promise<{
        id: string;
        title: string;
        content: string;
        images: string[];
        viewCount: number;
        updatedAt: Date;
    }>;
    deletePost(postId: string, userId: string): Promise<{
        message: string;
    }>;
    private extractPublicIdFromUrl;
}
export declare const postsService: PostsService;
//# sourceMappingURL=service.d.ts.map