import { Router } from "express";
import {
  getCoreValuesSection,
  getCoreValuesSectionById,
  getAllCoreValuesSections,
  createOrUpdateCoreValuesSection,
  updateCoreValuesSection,
  toggleActive,
  deleteCoreValuesSection,
} from "../controllers/coreValuesSection.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

export const router = Router();

// Public route - Get active core values section
router.get("/", getCoreValuesSection);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllCoreValuesSections);
router.get("/admin/:id", authenticate, authorize("admin"), getCoreValuesSectionById);
router.post("/", authenticate, authorize("admin"), createOrUpdateCoreValuesSection);
router.put("/:id", authenticate, authorize("admin"), updateCoreValuesSection);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteCoreValuesSection);

