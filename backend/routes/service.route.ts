import { Router } from "express";
import {
  getServices,
  getServiceById,
  getAllServices,
  createService,
  updateService,
  toggleActive,
  deleteService,
  reorderServices,
} from "../controllers/service.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadService } from "../utils/upload";

export const router = Router();

// Public route - Get active services
router.get("/", getServices);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllServices);
router.get("/admin/:id", authenticate, authorize("admin"), getServiceById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadService.single("backgroundImage"),
  createService
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadService.single("backgroundImage"),
  updateService
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteService);
router.patch("/reorder", authenticate, authorize("admin"), reorderServices);

