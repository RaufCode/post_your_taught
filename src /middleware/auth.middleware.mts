import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the user payload interface based on your JWT structure
export interface UserPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    // Attach user info to request object
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
