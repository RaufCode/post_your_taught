import type { Comment } from "@prisma/client";
export declare class CommentsRepository {
    createComment(data: {
        content: string;
        authorId: string;
        postId: string;
    }): Promise<Comment>;
    findCommentById(id: string): Promise<Comment | null>;
    getCommentsByPostId(postId: string, skip: number, take: number): Promise<{
        comments: Comment[];
        total: number;
    }>;
    deleteComment(id: string): Promise<void>;
    isCommentOwner(commentId: string, userId: string): Promise<boolean>;
}
export declare const commentsRepository: CommentsRepository;
//# sourceMappingURL=repository.d.ts.map