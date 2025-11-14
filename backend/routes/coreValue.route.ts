import { Router } from "express";
import {
  getCoreValues,
  getCoreValueById,
  getAllCoreValues,
  createCoreValue,
  updateCoreValue,
  toggleActive,
  deleteCoreValue,
  reorderCoreValues,
} from "../controllers/coreValue.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

export const router = Router();

// Public route - Get active core values
router.get("/", getCoreValues);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllCoreValues);
router.get("/admin/:id", authenticate, authorize("admin"), getCoreValueById);
router.post("/", authenticate, authorize("admin"), createCoreValue);
router.put("/:id", authenticate, authorize("admin"), updateCoreValue);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteCoreValue);
router.patch("/reorder", authenticate, authorize("admin"), reorderCoreValues);

