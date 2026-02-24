import multer from "multer";
import path from "path";
import crypto from "crypto";
import { BadRequestError } from "../utils/AppError.js";
// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "uploads/");
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
// File filter for images only
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(BadRequestError("Only image files (JPEG, PNG, GIF, WebP) are allowed"));
    }
};
// Configure multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
        files: 5, // Max 5 files per upload
    },
});
// Single image upload
export const uploadSingle = upload.single("image");
// Multiple images upload
export const uploadMultiple = upload.array("images", 5);
// Profile image upload (single, smaller size)
export const uploadProfile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max for profile
        files: 1,
    },
}).single("profileImage");
//# sourceMappingURL=upload.js.map