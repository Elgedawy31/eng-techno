import { Router } from "express";
import {
  logout,
  login,
  checkAuth,
  getUserData,
} from "../controllers/auth.controller";

export const router = Router();


router.post("/login", login);

// Check authentication status
router.get("/check-auth", checkAuth);

// Get user profile/data
router.get("/user-data", getUserData);

// Logout route
router.get("/logout", logout);

