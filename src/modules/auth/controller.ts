import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authService } from "./service.js";
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
} from "./schema.js";
import { env } from "../../config/env.js";

export class AuthController {
  register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as RegisterInput;
    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      data: result,
    });
  });

  login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as LoginInput;
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

  refreshToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from cookie or body
    const refreshToken =
      (req.cookies?.refreshToken as string | undefined) ||
      (req.body as RefreshTokenInput).refreshToken;

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

  logout: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

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
