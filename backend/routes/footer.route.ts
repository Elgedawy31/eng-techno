import { Router } from "express";
import {
  getFooter,
  getFooterById,
  getAllFooters,
  createOrUpdateFooter,
  updateFooter,
  toggleActive,
  deleteFooter,
} from "../controllers/footer.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

export const router = Router();

// Public route - Get active footer
router.get("/", getFooter);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllFooters);
router.get("/admin/:id", authenticate, authorize("admin"), getFooterById);
router.post("/", authenticate, authorize("admin"), createOrUpdateFooter);
router.put("/:id", authenticate, authorize("admin"), updateFooter);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteFooter);

