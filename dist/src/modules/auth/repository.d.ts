import type { User, RefreshToken } from "@prisma/client";
export declare class AuthRepository {
    findUserByEmail(email: string): Promise<User | null>;
    findUserByUsername(username: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    createUser(data: {
        email: string;
        username: string;
        password: string;
    }): Promise<User>;
    verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    createRefreshToken(data: {
        userId: string;
        token: string;
        expiresAt: Date;
    }): Promise<RefreshToken>;
    findRefreshToken(token: string): Promise<RefreshToken | null>;
    deleteRefreshToken(token: string): Promise<void>;
    deleteAllUserRefreshTokens(userId: string): Promise<void>;
    revokeExpiredRefreshTokens(): Promise<void>;
}
export declare const authRepository: AuthRepository;
//# sourceMappingURL=repository.d.ts.map