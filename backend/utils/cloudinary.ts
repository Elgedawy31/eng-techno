import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";
import { Readable } from "stream";

// Configure Cloudinary
if (env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
  console.log("Cloudinary configured successfully for cloud:", env.cloudinary.cloudName);
} else {
  console.warn("Warning: Cloudinary credentials are not fully configured. File uploads may fail.");
  console.warn("Missing:", {
    cloudName: !env.cloudinary.cloudName,
    apiKey: !env.cloudinary.apiKey,
    apiSecret: !env.cloudinary.apiSecret,
  });
}

// Helper function to upload buffer to Cloudinary
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  publicId?: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ secure_url: string; public_id: string }> => {
  // Validate Cloudinary configuration
  if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
    throw new Error("Cloudinary credentials are not properly configured. Please check your environment variables.");
  }

  // Ensure config is applied before each upload (in case it was reset)
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });

  // Debug logging
  console.log("Uploading to Cloudinary:", {
    folder,
    publicId,
    resourceType,
    bufferSize: buffer.length,
    hasConfig: !!env.cloudinary.cloudName && !!env.cloudinary.apiKey && !!env.cloudinary.apiSecret,
  });

  return new Promise((resolve, reject) => {
    // Build upload options - do NOT include api_key/api_secret here
    // They should only be in the global config for signed uploads
    const uploadOptions: any = {
      folder: folder,
      resource_type: resourceType,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error: any, result: any) => {
        if (error) {
          // Provide more helpful error messages
          if (error.message?.includes("Upload preset") || error.http_code === 400) {
            const errorMsg = `Cloudinary upload failed: ${error.message}. `;
            const suggestion = "Please verify your Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are correct in your .env file and restart the server.";
            reject(new Error(errorMsg + suggestion));
          } else {
            reject(error);
          }
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
export const deleteFromCloudinary = async (publicIdOrUrl: string, resourceType: "image" | "video" | "raw" = "image"): Promise<void> => {
  try {
    // Extract public_id from URL if URL is provided
    let publicId = publicIdOrUrl;
    let detectedResourceType = resourceType;
    
    // If it's a URL, extract the public_id and detect resource type
    if (publicIdOrUrl.includes("cloudinary.com")) {
      const urlParts = publicIdOrUrl.split("/");
      const uploadIndex = urlParts.findIndex((part) => part === "upload");
      
      // Detect resource type from URL path
      // Cloudinary URLs can be: .../image/upload/... or .../video/upload/... or .../raw/upload/...
      if (uploadIndex > 0) {
        const beforeUpload = urlParts[uploadIndex - 1];
        if (beforeUpload === "video") {
          detectedResourceType = "video";
        } else if (beforeUpload === "raw") {
          detectedResourceType = "raw";
        } else {
          detectedResourceType = "image"; // Default to image
        }
      }
      
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
      resource_type: detectedResourceType,
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

