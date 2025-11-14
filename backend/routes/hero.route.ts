import { Router } from "express";
import {
  getHero,
  getHeroById,
  getAllHeroes,
  createOrUpdateHero,
  updateHero,
  toggleActive,
  deleteHero,
} from "../controllers/hero.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadHero } from "../utils/upload";

export const router = Router();

// Public route - Get active hero section
router.get("/", getHero);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllHeroes);
router.get("/admin/:id", authenticate, authorize("admin"), getHeroById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadHero.single("backgroundImage"),
  createOrUpdateHero
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadHero.single("backgroundImage"),
  updateHero
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteHero);


