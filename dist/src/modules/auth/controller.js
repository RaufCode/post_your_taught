import { asyncHandler } from "../../utils/asyncHandler.js";
import { authService } from "./service.js";
import { env } from "../../config/env.js";
export class AuthController {
    register = asyncHandler(async (req, res) => {
        const data = req.body;
        const result = await authService.register(data);
        res.status(201).json({
            success: true,
            data: result,
        });
    });
    login = asyncHandler(async (req, res) => {
        const data = req.body;
        const result = await authService.login(data);
        // Set refresh token as HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            success: true,
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    });
    refreshToken = asyncHandler(async (req, res) => {
        // Get refresh token from cookie or body
        const refreshToken = req.cookies?.refreshToken ||
            req.body.refreshToken;
        const result = await authService.refreshToken({ refreshToken });
        // Set new refresh token as HTTP-only cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            success: true,
            data: {
                accessToken: result.accessToken,
            },
        });
    });
    logout = asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;
        await authService.logout(refreshToken);
        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            success: true,
            data: { message: "Logged out successfully" },
        });
    });
}
export const authController = new AuthController();
//# sourceMappingURL=controller.js.map