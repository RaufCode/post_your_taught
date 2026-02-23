export interface TokenPayload {
    userId: string;
    email: string;
    username: string;
}
export interface AccessTokenPayload extends TokenPayload {
    type: "access";
}
export interface RefreshTokenPayload extends TokenPayload {
    type: "refresh";
    tokenId: string;
}
export declare const generateAccessToken: (payload: TokenPayload) => string;
export declare const generateRefreshToken: (payload: TokenPayload, tokenId: string) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload;
export declare const decodeToken: (token: string) => TokenPayload | null;
//# sourceMappingURL=jwt.d.ts.map