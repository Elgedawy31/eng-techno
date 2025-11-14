import { Router } from "express";
import {
  getMediaCentre,
  getMediaCentreById,
  getAllMediaCentres,
  createOrUpdateMediaCentre,
  updateMediaCentre,
  toggleActive,
  deleteMediaCentre,
} from "../controllers/mediaCentre.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

export const router = Router();

// Public route - Get active media centre section
router.get("/", getMediaCentre);

// Admin routes - require authentication and admin role
router.get("/admin", getAllMediaCentres);
router.get("/admin/:id", authenticate, authorize("admin"), getMediaCentreById);
router.post("/", authenticate, authorize("admin"), createOrUpdateMediaCentre);
router.put("/:id", authenticate, authorize("admin"), updateMediaCentre);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteMediaCentre);

