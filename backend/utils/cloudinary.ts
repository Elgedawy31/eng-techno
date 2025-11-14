import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

// Helper function to upload buffer to Cloudinary
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto", // auto-detect image, video, or raw (PDF)
        public_id: publicId,
      },
      (error: any, result: any) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error("Upload failed: No result returned"));
        }
      }
    );

    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicIdOrUrl: string): Promise<void> => {
  try {
    // Extract public_id from URL if URL is provided
    let publicId = publicIdOrUrl;
    
    // If it's a URL, extract the public_id
    if (publicIdOrUrl.includes("cloudinary.com")) {
      const urlParts = publicIdOrUrl.split("/");
      const uploadIndex = urlParts.findIndex((part) => part === "upload");
      if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
        // Extract public_id from URL (format: upload/v1234567890/folder/filename)
        const afterUpload = urlParts.slice(uploadIndex + 2).join("/");
        const extractedId = afterUpload.split(".")[0]; // Remove file extension
        if (extractedId) {
          publicId = extractedId;
        }
      }
    } else {
      // If it's already a public_id, use it directly
      // Remove /uploads/ prefix if present
      publicId = publicId.replace(/^\/?uploads\//, "");
    }

    // Delete from Cloudinary
    if (!publicId) {
      return; // Can't delete without a valid public_id
    }
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    if (result && result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Failed to delete from Cloudinary: ${result.result}`);
    }
  } catch (error) {
    // If file doesn't exist, that's okay
    if ((error as any)?.http_code === 404) {
      return;
    }
    throw error;
  }
};

// Helper to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url || !url.includes("cloudinary.com")) {
      return null;
    }
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
      const afterUpload = urlParts.slice(uploadIndex + 2).join("/");
      const publicId = afterUpload.split(".")[0];
      return publicId || null;
    }
    return null;
  } catch {
    return null;
  }
};

export { cloudinary };

