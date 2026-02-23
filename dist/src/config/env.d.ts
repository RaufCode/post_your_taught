export declare const env: {
    readonly PORT: number;
    readonly BCRYPT_SALT_ROUNDS: number;
    readonly RATE_LIMIT_WINDOW_MS: number;
    readonly RATE_LIMIT_MAX_REQUESTS: number;
    readonly NODE_ENV: "development" | "production" | "test";
    readonly DATABASE_URL: string;
    readonly JWT_ACCESS_SECRET: string;
    readonly JWT_REFRESH_SECRET: string;
    readonly JWT_ACCESS_EXPIRES_IN: string;
    readonly JWT_REFRESH_EXPIRES_IN: string;
    readonly CORS_ORIGIN: string;
    readonly CLOUDINARY_CLOUD_NAME?: string | undefined;
    readonly CLOUDINARY_API_KEY?: string | undefined;
    readonly CLOUDINARY_API_SECRET?: string | undefined;
};
export type Env = typeof env;
//# sourceMappingURL=env.d.ts.map