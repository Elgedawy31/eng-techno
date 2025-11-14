import { Router } from "express";
import {
  getAboutPageContent,
  getAboutPageContentById,
  getAllAboutPageContents,
  createOrUpdateAboutPageContent,
  updateAboutPageContent,
  toggleActive,
  deleteAboutPageContent,
} from "../controllers/aboutPageContent.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadAboutPageContent } from "../utils/upload";

export const router = Router();

// Public route - Get active about page content
router.get("/", getAboutPageContent);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllAboutPageContents);
router.get("/admin/:id", authenticate, authorize("admin"), getAboutPageContentById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadAboutPageContent.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
    { name: "companyProfileFile", maxCount: 1 },
  ]),
  createOrUpdateAboutPageContent
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadAboutPageContent.fields([
    { name: "backgroundImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
    { name: "companyProfileFile", maxCount: 1 },
  ]),
  updateAboutPageContent
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteAboutPageContent);

