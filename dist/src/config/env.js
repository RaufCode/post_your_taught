import { z } from "zod";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
/**
 * Environment variable schema validation using Zod
 * All environment variables are validated at startup
 * Missing or invalid variables will cause the application to exit
 */
const envSchema = z.object({
    // ==========================================
    // Application Configuration
    // ==========================================
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("3000"),
    // ==========================================
    // Database Configuration
    // ==========================================
    DATABASE_URL: z.string(),
    // ==========================================
    // JWT Authentication Secrets
    // ==========================================
    JWT_ACCESS_SECRET: z.string().min(32, "JWT access secret must be at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT refresh secret must be at least 32 characters"),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    // ==========================================
    // Security Configuration
    // ==========================================
    BCRYPT_SALT_ROUNDS: z.string().default("12"),
    RATE_LIMIT_WINDOW_MS: z.string().default("900000"),
    RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),
    // ==========================================
    // CORS Configuration
    // ==========================================
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
    // ==========================================
    // Cloudinary Configuration (Optional)
    // ==========================================
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});
// Validate environment variables
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables:", parsedEnv.error.format());
    console.error("\nPlease check your .env file and ensure all required variables are set.");
    console.error("Copy .env.example to .env and fill in the values.\n");
    process.exit(1);
}
// Export parsed and transformed environment variables
export const env = {
    ...parsedEnv.data,
    // Transform string values to numbers
    PORT: parseInt(parsedEnv.data.PORT, 10),
    BCRYPT_SALT_ROUNDS: parseInt(parsedEnv.data.BCRYPT_SALT_ROUNDS, 10),
    RATE_LIMIT_WINDOW_MS: parseInt(parsedEnv.data.RATE_LIMIT_WINDOW_MS, 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(parsedEnv.data.RATE_LIMIT_MAX_REQUESTS, 10),
};
//# sourceMappingURL=env.js.map