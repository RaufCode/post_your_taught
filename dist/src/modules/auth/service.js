import { ConflictError, UnauthorizedError, NotFoundError, } from "../../utils/AppError.ts";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, } from "../../utils/jwt.ts";
import { authRepository } from "./repository.ts";
import { logger } from "../../config/logger.ts";
import { env } from "../../config/env.ts";
export class AuthService {
    async register(data) {
        // Check if email already exists
        const existingEmail = await authRepository.findUserByEmail(data.email);
        if (existingEmail) {
            throw ConflictError("Email already registered");
        }
        // Check if username already exists
        const existingUsername = await authRepository.findUserByUsername(data.username);
        if (existingUsername) {
            throw ConflictError("Username already taken");
        }
        // Create user
        const user = await authRepository.createUser({
            email: data.email,
            username: data.username,
            password: data.password,
        });
        logger.info({ message: "New user registered", userId: user.id });
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.username);
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profileImage: user.profileImage,
            },
            ...tokens,
        };
    }
    async login(data) {
        // Find user by email
        const user = await authRepository.findUserByEmail(data.email);
        if (!user) {
            throw UnauthorizedError("Invalid credentials");
        }
        // Verify password
        const isPasswordValid = await authRepository.verifyPassword(data.password, user.password);
        if (!isPasswordValid) {
            throw UnauthorizedError("Invalid credentials");
        }
        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email, user.username);
        logger.info({ message: "User logged in", userId: user.id });
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profileImage: user.profileImage,
            },
            ...tokens,
        };
    }
    async refreshToken(data) {
        // Verify the refresh token
        let payload;
        try {
            payload = verifyRefreshToken(data.refreshToken);
        }
        catch {
            throw UnauthorizedError("Invalid refresh token");
        }
        // Check if token exists in database
        const storedToken = await authRepository.findRefreshToken(data.refreshToken);
        if (!storedToken) {
            throw UnauthorizedError("Refresh token not found");
        }
        // Check if token is expired
        if (new Date() > storedToken.expiresAt) {
            await authRepository.deleteRefreshToken(data.refreshToken);
            throw UnauthorizedError("Refresh token expired");
        }
        // Delete the old refresh token (rotation)
        await authRepository.deleteRefreshToken(data.refreshToken);
        // Generate new tokens
        const tokens = await this.generateTokens(payload.userId, payload.email, payload.username);
        logger.info({ message: "Token refreshed", userId: payload.userId });
        return tokens;
    }
    async logout(refreshToken) {
        if (!refreshToken) {
            return { message: "Logged out successfully" };
        }
        try {
            // Verify token to get user info
            const payload = verifyRefreshToken(refreshToken);
            // Delete the specific refresh token
            await authRepository.deleteRefreshToken(refreshToken);
            logger.info({ message: "User logged out", userId: payload.userId });
        }
        catch {
            // Even if token is invalid, we consider logout successful
            logger.debug({ message: "Logout with invalid token" });
        }
        return { message: "Logged out successfully" };
    }
    async logoutAll(userId) {
        // Delete all refresh tokens for the user
        await authRepository.deleteAllUserRefreshTokens(userId);
        logger.info({ message: "User logged out from all devices", userId });
        return { message: "Logged out from all devices" };
    }
    async generateTokens(userId, email, username) {
        // Generate access token
        const accessToken = generateAccessToken({
            userId,
            email,
            username,
        });
        // Generate refresh token with unique ID
        const tokenId = crypto.randomUUID();
        const refreshToken = generateRefreshToken({
            userId,
            email,
            username,
        }, tokenId);
        // Calculate expiration date
        const expiresInDays = parseInt(env.JWT_REFRESH_EXPIRES_IN.replace("d", ""));
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);
        // Store refresh token in database
        await authRepository.createRefreshToken({
            userId,
            token: refreshToken,
            expiresAt,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
}
export const authService = new AuthService();
//# sourceMappingURL=service.js.map