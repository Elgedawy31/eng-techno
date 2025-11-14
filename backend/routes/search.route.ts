import { Router } from "express";
import {
  getSearch,
  getSearchById,
  getAllSearches,
  createOrUpdateSearch,
  updateSearch,
  toggleActive,
  deleteSearch,
} from "../controllers/search.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadSearch } from "../utils/upload";

export const router = Router();

// Public route - Get active search section
router.get("/", getSearch);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllSearches);
router.get("/admin/:id", authenticate, authorize("admin"), getSearchById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadSearch.single("logoImage"),
  createOrUpdateSearch
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadSearch.single("logoImage"),
  updateSearch
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteSearch);

