import { Router } from "express";
import {
  getClientPartners,
  getClientPartnerById,
  getAllClientPartners,
  createClientPartner,
  updateClientPartner,
  toggleActive,
  deleteClientPartner,
  reorderClientPartners,
} from "../controllers/clientPartner.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { uploadClientPartner } from "../utils/upload";

export const router = Router();

// Public route - Get active client partners
router.get("/", getClientPartners);

// Admin routes - require authentication and admin role
router.get("/admin", authenticate, authorize("admin"), getAllClientPartners);
router.get("/admin/:id", authenticate, authorize("admin"), getClientPartnerById);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadClientPartner.single("emblemImage"),
  createClientPartner
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadClientPartner.single("emblemImage"),
  updateClientPartner
);
router.patch("/:id/toggle", authenticate, authorize("admin"), toggleActive);
router.delete("/:id", authenticate, authorize("admin"), deleteClientPartner);
router.patch("/reorder", authenticate, authorize("admin"), reorderClientPartners);

