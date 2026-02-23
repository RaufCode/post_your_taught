import type { RegisterInput, LoginInput, RefreshTokenInput } from "./schema.ts";
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            profileImage: string | null;
        };
    }>;
    login(data: LoginInput): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            profileImage: string | null;
        };
    }>;
    refreshToken(data: RefreshTokenInput): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string | undefined): Promise<{
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
}
export declare const authService: AuthService;
//# sourceMappingURL=service.d.ts.map