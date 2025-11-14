import multer from "multer";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary";

// File filter for images
const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Please use JPEG, PNG, or WebP"));
  }
};

// File filter for PDFs
const pdfFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["application/pdf"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Please use PDF"));
  }
};

// Combined filter for images and PDFs
const imageAndPdfFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Please use JPEG, PNG, WebP, or PDF"));
  }
};

// Multer memory storage - files will be stored in memory as buffers
const memoryStorage = multer.memoryStorage();

// User uploads
export const uploadUser = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Hero uploads
export const uploadHero = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for hero images
  },
});

// About uploads (PDF)
export const uploadAbout = multer({
  storage: memoryStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size for PDF files
  },
});

// Service uploads
export const uploadService = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for service images
  },
});

// Search uploads
export const uploadSearch = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size for search logo
  },
});

// Event uploads
export const uploadEvent = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for event images
    files: 11, // 1 logo + up to 10 display images
  },
});

// Announcement uploads
export const uploadAnnouncement = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for announcement images
    files: 2, // 1 logo + 1 background image
  },
});

// About Page Hero uploads
export const uploadAboutPageHero = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for hero images
  },
});

// About Page Content uploads
export const uploadAboutPageContent = multer({
  storage: memoryStorage,
  fileFilter: imageAndPdfFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
    files: 3, // backgroundImage + logoImage + companyProfileFile
  },
});

// Client Partner uploads
export const uploadClientPartner = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size for emblem images
  },
});

// Mission Vision uploads
export const uploadMissionVision = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for images
    files: 4, // missionLogo + missionImage + visionLogo + visionImage
  },
});

// Compliance Quality uploads
export const uploadComplianceQuality = multer({
  storage: memoryStorage,
  fileFilter: imageAndPdfFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
    files: 3, // logoImage + displayImage + companyProfileFile
  },
});

// Delete file from Cloudinary
export const deleteFile = async (filePathOrUrl: string): Promise<void> => {
  await deleteFromCloudinary(filePathOrUrl);
};

// Get relative path - now returns Cloudinary URL as-is
// This function is kept for backward compatibility but just returns the URL
export const getRelativePath = (url: string): string => {
  // If it's already a Cloudinary URL, return it
  if (url.includes("cloudinary.com")) {
    return url;
  }
  // For backward compatibility with old local paths
  return url;
};

// Helper function to upload file buffer to Cloudinary
export const uploadFileToCloudinary = async (
  buffer: Buffer,
  folder: string,
  filename?: string
): Promise<string> => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const publicId = filename ? `${folder}-${filename}-${uniqueSuffix}` : `${folder}-${uniqueSuffix}`;
  const result = await uploadToCloudinary(buffer, folder, publicId);
  return result.secure_url;
};

// Helper function to process multer file and upload to Cloudinary
export const processFileUpload = async (
  file: Express.Multer.File | undefined,
  folder: string,
  fieldName?: string
): Promise<string | undefined> => {
  if (!file || !file.buffer) {
    return undefined;
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const publicId = fieldName 
    ? `${folder}-${fieldName}-${uniqueSuffix}` 
    : `${folder}-${uniqueSuffix}`;
  
  const result = await uploadToCloudinary(file.buffer, folder, publicId);
  return result.secure_url;
};

// Helper function to process multiple files
export const processMultipleFiles = async (
  files: Express.Multer.File[] | undefined,
  folder: string,
  fieldNameMap?: Record<string, string>
): Promise<Record<string, string>> => {
  const result: Record<string, string> = {};
  
  if (!files || files.length === 0) {
    return result;
  }

  for (const file of files) {
    if (!file.buffer) continue;
    
    const fieldName = fieldNameMap?.[file.fieldname] || file.fieldname;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const publicId = `${folder}-${fieldName}-${uniqueSuffix}`;
    
    const uploadResult = await uploadToCloudinary(file.buffer, folder, publicId);
    result[file.fieldname] = uploadResult.secure_url;
  }

  return result;
};
