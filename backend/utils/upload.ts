import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ensureUploadsDir = (subfolder: string) => {
  const uploadPath = path.join(__dirname, "../uploads", subfolder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

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
    cb(new Error("نوع الملف غير مدعوم. يرجى استخدام JPEG أو PNG أو WebP"));
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

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userPath = ensureUploadsDir("users");
    cb(null, userPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `user-${uniqueSuffix}${ext}`);
  },
});

export const uploadUser = multer({
  storage: userStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const heroPath = ensureUploadsDir("hero");
    cb(null, heroPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `hero-${uniqueSuffix}${ext}`);
  },
});

export const uploadHero = multer({
  storage: heroStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for hero images
  },
});

const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const aboutPath = ensureUploadsDir("about");
    cb(null, aboutPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `company-profile-${uniqueSuffix}${ext}`);
  },
});

export const uploadAbout = multer({
  storage: aboutStorage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size for PDF files
  },
});

const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const servicePath = ensureUploadsDir("services");
    cb(null, servicePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `service-${uniqueSuffix}${ext}`);
  },
});

export const uploadService = multer({
  storage: serviceStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for service images
  },
});

const searchStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const searchPath = ensureUploadsDir("search");
    cb(null, searchPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `search-logo-${uniqueSuffix}${ext}`);
  },
});

export const uploadSearch = multer({
  storage: searchStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size for search logo
  },
});

const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const eventPath = ensureUploadsDir("events");
    cb(null, eventPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fieldName = file.fieldname === "eventLogoImage" ? "logo" : "display";
    cb(null, `event-${fieldName}-${uniqueSuffix}${ext}`);
  },
});

export const uploadEvent = multer({
  storage: eventStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for event images
    files: 11, // 1 logo + up to 10 display images
  },
});

const announcementStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const announcementPath = ensureUploadsDir("announcements");
    cb(null, announcementPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const fieldName = file.fieldname === "eventLogoImage" ? "logo" : "background";
    cb(null, `announcement-${fieldName}-${uniqueSuffix}${ext}`);
  },
});

export const uploadAnnouncement = multer({
  storage: announcementStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for announcement images
    files: 2, // 1 logo + 1 background image
  },
});

const aboutPageHeroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const aboutPageHeroPath = ensureUploadsDir("about-page-hero");
    cb(null, aboutPageHeroPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `about-page-hero-${uniqueSuffix}${ext}`);
  },
});

export const uploadAboutPageHero = multer({
  storage: aboutPageHeroStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for hero images
  },
});

const aboutPageContentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const aboutPageContentPath = ensureUploadsDir("about-page-content");
    cb(null, aboutPageContentPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    if (file.fieldname === "logoImage") {
      cb(null, `about-page-logo-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "backgroundImage") {
      cb(null, `about-page-bg-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "companyProfileFile") {
      cb(null, `company-profile-${uniqueSuffix}${ext}`);
    } else {
      cb(null, `about-page-${uniqueSuffix}${ext}`);
    }
  },
});

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

export const uploadAboutPageContent = multer({
  storage: aboutPageContentStorage,
  fileFilter: imageAndPdfFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
    files: 3, // backgroundImage + logoImage + companyProfileFile
  },
});

const clientPartnerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const clientPartnerPath = ensureUploadsDir("client-partners");
    cb(null, clientPartnerPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `client-partner-emblem-${uniqueSuffix}${ext}`);
  },
});

export const uploadClientPartner = multer({
  storage: clientPartnerStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size for emblem images
  },
});

const missionVisionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const missionVisionPath = ensureUploadsDir("mission-vision");
    cb(null, missionVisionPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    if (file.fieldname === "missionLogoImage") {
      cb(null, `mission-logo-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "missionImage") {
      cb(null, `mission-image-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "visionLogoImage") {
      cb(null, `vision-logo-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "visionImage") {
      cb(null, `vision-image-${uniqueSuffix}${ext}`);
    } else {
      cb(null, `mission-vision-${uniqueSuffix}${ext}`);
    }
  },
});

export const uploadMissionVision = multer({
  storage: missionVisionStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for images
    files: 4, // missionLogo + missionImage + visionLogo + visionImage
  },
});

const complianceQualityStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const complianceQualityPath = ensureUploadsDir("compliance-quality");
    cb(null, complianceQualityPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    if (file.fieldname === "logoImage") {
      cb(null, `compliance-logo-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "displayImage") {
      cb(null, `compliance-display-${uniqueSuffix}${ext}`);
    } else if (file.fieldname === "companyProfileFile") {
      cb(null, `company-profile-${uniqueSuffix}${ext}`);
    } else {
      cb(null, `compliance-quality-${uniqueSuffix}${ext}`);
    }
  },
});

export const uploadComplianceQuality = multer({
  storage: complianceQualityStorage,
  fileFilter: imageAndPdfFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
    files: 3, // logoImage + displayImage + companyProfileFile
  },
});

export const deleteFile = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const fullPath = path.join(__dirname, "..", cleanPath);
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== "ENOENT") {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getRelativePath = (absolutePath: string): string => {
  const uploadsPath = path.join(__dirname, "../uploads");
  return path.relative(uploadsPath, absolutePath).replace(/\\/g, "/");
};

