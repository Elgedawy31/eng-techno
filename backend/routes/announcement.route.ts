import { Router } from "express";
import {
  getAnnouncements,
  getAnnouncementById,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  toggleActive,
  deleteAnnouncement,
} from "../controllers/announcement.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadAnnouncement } from "../utils/upload";

export const router = Router();

// Public route - Get active announcements
router.get("/", getAnnouncements);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllAnnouncements);
router.get("/admin/:id", authenticate, authorize("admin"), getAnnouncementById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadAnnouncement.single("eventLogoImage"),
  createAnnouncement
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadAnnouncement.single("eventLogoImage"),
  updateAnnouncement
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteAnnouncement);

