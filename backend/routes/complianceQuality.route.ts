import { Router } from "express";
import {
  getComplianceQuality,
  getComplianceQualityById,
  getAllComplianceQualities,
  createOrUpdateComplianceQuality,
  updateComplianceQuality,
  toggleActive,
  deleteComplianceQuality,
} from "../controllers/complianceQuality.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadComplianceQuality } from "../utils/upload";

export const router = Router();

// Public route - Get active compliance & quality section
router.get("/", getComplianceQuality);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllComplianceQualities);
router.get("/admin/:id", authenticate, authorize("admin"), getComplianceQualityById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadComplianceQuality.fields([
    { name: "logoImage", maxCount: 1 },
    { name: "displayImage", maxCount: 1 },
    { name: "companyProfileFile", maxCount: 1 },
  ]),
  createOrUpdateComplianceQuality
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadComplianceQuality.fields([
    { name: "logoImage", maxCount: 1 },
    { name: "displayImage", maxCount: 1 },
    { name: "companyProfileFile", maxCount: 1 },
  ]),
  updateComplianceQuality
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteComplianceQuality);

