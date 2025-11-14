import { Router } from "express";
import {
  getEvents,
  getEventById,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEventImage,
  toggleActive,
  deleteEvent,
  reorderEvents,
} from "../controllers/event.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadEvent } from "../utils/upload";

export const router = Router();

// Public route - Get active events
router.get("/", getEvents);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllEvents);
router.get("/admin/:id", authenticate, authorize("admin"), getEventById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadEvent.fields([
    { name: "eventLogoImage", maxCount: 1 },
    { name: "displayImages", maxCount: 10 },
  ]),
  createEvent
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadEvent.fields([
    { name: "eventLogoImage", maxCount: 1 },
    { name: "displayImages", maxCount: 10 },
  ]),
  updateEvent
);
router.delete("/:id/image", authenticate, authorize("admin"), deleteEventImage);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteEvent);
router.patch("/reorder", authenticate, authorize("admin"), reorderEvents);

