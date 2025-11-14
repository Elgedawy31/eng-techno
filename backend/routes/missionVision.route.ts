import { Router } from "express";
import {
  getMissionVision,
  getMissionVisionById,
  getAllMissionVisions,
  createOrUpdateMissionVision,
  updateMissionVision,
  toggleActive,
  deleteMissionVision,
} from "../controllers/missionVision.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadMissionVision } from "../utils/upload";

export const router = Router();

// Public route - Get active mission & vision
router.get("/", getMissionVision);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllMissionVisions);
router.get("/admin/:id", authenticate, authorize("admin"), getMissionVisionById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadMissionVision.fields([
    { name: "missionLogoImage", maxCount: 1 },
    { name: "missionImage", maxCount: 1 },
    { name: "visionLogoImage", maxCount: 1 },
    { name: "visionImage", maxCount: 1 },
  ]),
  createOrUpdateMissionVision
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadMissionVision.fields([
    { name: "missionLogoImage", maxCount: 1 },
    { name: "missionImage", maxCount: 1 },
    { name: "visionLogoImage", maxCount: 1 },
    { name: "visionImage", maxCount: 1 },
  ]),
  updateMissionVision
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteMissionVision);

