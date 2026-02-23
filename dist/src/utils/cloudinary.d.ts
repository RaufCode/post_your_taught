export interface UploadResult {
    url: string;
    publicId: string;
}
export declare const uploadToCloudinary: (filePath: string, folder?: string) => Promise<UploadResult>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<void>;
export declare const uploadMultipleToCloudinary: (filePaths: string[], folder?: string) => Promise<UploadResult[]>;
//# sourceMappingURL=cloudinary.d.ts.map