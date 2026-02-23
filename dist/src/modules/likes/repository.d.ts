import type { Like } from "@prisma/client";
export declare class LikesRepository {
    findLikeByUserAndPost(userId: string, postId: string): Promise<Like | null>;
    createLike(data: {
        userId: string;
        postId: string;
    }): Promise<Like>;
    deleteLike(id: string): Promise<void>;
    getLikesCountByPostId(postId: string): Promise<number>;
}
export declare const likesRepository: LikesRepository;
//# sourceMappingURL=repository.d.ts.map