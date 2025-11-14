import { Router } from "express";
import {
  getAbout,
  getAboutById,
  getAllAbouts,
  createOrUpdateAbout,
  updateAbout,
  toggleActive,
  deleteAbout,
} from "../controllers/about.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadAbout } from "../utils/upload";

export const router = Router();

// Public route - Get active about section
router.get("/", getAbout);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllAbouts);
router.get("/admin/:id", authenticate, authorize("admin"), getAboutById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadAbout.single("companyProfileFile"),
  createOrUpdateAbout
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadAbout.single("companyProfileFile"),
  updateAbout
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteAbout);

