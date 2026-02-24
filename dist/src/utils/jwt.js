import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const generateAccessToken = (payload) => {
    return jwt.sign({ ...payload, type: "access" }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
};
export const generateRefreshToken = (payload, tokenId) => {
    return jwt.sign({ ...payload, type: "refresh", tokenId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=jwt.js.map