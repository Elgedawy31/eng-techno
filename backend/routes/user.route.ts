import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

export const router = Router();

// Admin routes - require authentication and admin role
router.get("/", authenticate, authorize("admin"), getAllUsers);
router.get("/:id", authenticate, authorize("admin"), getUserById);
router.post("/", authenticate, authorize("admin"), createUser);
router.put("/:id", authenticate, authorize("admin"), updateUser);
router.delete("/:id", authenticate, authorize("admin"), deleteUser);

