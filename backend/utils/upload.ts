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

