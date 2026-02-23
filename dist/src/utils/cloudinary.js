import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.ts";
import { logger } from "../config/logger.ts";
// Configure Cloudinary if credentials are available
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
    });
}
export const uploadToCloudinary = async (filePath, folder = "blog") => {
    try {
        // If Cloudinary is not configured, return a local URL
        if (!env.CLOUDINARY_CLOUD_NAME) {
            logger.warn("Cloudinary not configured, using local file path");
            return {
                url: `/uploads/${filePath.split("/").pop()}`,
                publicId: "",
            };
        }
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto",
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    catch (error) {
        logger.error({ message: "Failed to upload to Cloudinary", error, filePath });
        throw new Error("File upload failed");
    }
};
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId || !env.CLOUDINARY_CLOUD_NAME)
        return;
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        logger.error({ message: "Failed to delete from Cloudinary", error, publicId });
    }
};
export const uploadMultipleToCloudinary = async (filePaths, folder = "blog") => {
    const uploadPromises = filePaths.map((path) => uploadToCloudinary(path, folder));
    return Promise.all(uploadPromises);
};
//# sourceMappingURL=cloudinary.js.map