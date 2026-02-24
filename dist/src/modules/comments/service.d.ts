import type { CreateCommentInput, PaginationQuery } from "./schema.js";
export declare class CommentsService {
    createComment(authorId: string, postId: string, data: CreateCommentInput): Promise<{
        id: string;
        content: string;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
        };
        createdAt: Date;
    }>;
    getCommentsByPostId(postId: string, query: PaginationQuery): Promise<import("../../utils/pagination.js").PaginatedResult<{
        id: string;
        content: string;
        author: {
            id: string;
            username: string;
            profileImage: string | null;
        };
        createdAt: Date;
    }>>;
    deleteComment(commentId: string, userId: string): Promise<{
        message: string;
    }>;
}
export declare const commentsService: CommentsService;
//# sourceMappingURL=service.d.ts.map