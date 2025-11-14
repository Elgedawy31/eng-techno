import { Router } from "express";
import {
  getAboutPageHero,
  getAboutPageHeroById,
  getAllAboutPageHeroes,
  createOrUpdateAboutPageHero,
  updateAboutPageHero,
  toggleActive,
  deleteAboutPageHero,
} from "../controllers/aboutPageHero.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadAboutPageHero } from "../utils/upload";

export const router = Router();

// Public route - Get active about page hero
router.get("/", getAboutPageHero);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllAboutPageHeroes);
router.get("/admin/:id", authenticate, authorize("admin"), getAboutPageHeroById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadAboutPageHero.single("backgroundImage"),
  createOrUpdateAboutPageHero
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadAboutPageHero.single("backgroundImage"),
  updateAboutPageHero
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteAboutPageHero);

