import { Router } from "express";
import {
  getClientsPartnersSection,
  getClientsPartnersSectionById,
  getAllClientsPartnersSections,
  createOrUpdateClientsPartnersSection,
  updateClientsPartnersSection,
  toggleActive,
  deleteClientsPartnersSection,
} from "../controllers/clientsPartnersSection.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

export const router = Router();

// Public route - Get active clients & partners section
router.get("/", getClientsPartnersSection);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllClientsPartnersSections);
router.get("/admin/:id", authenticate, authorize("admin"), getClientsPartnersSectionById);
router.post("/", authenticate, authorize("admin"), createOrUpdateClientsPartnersSection);
router.put("/:id", authenticate, authorize("admin"), updateClientsPartnersSection);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteClientsPartnersSection);

