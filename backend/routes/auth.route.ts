import { Router } from "express";
import passport from "passport";
import {
  handleGoogleCallback,
  logout,
  login,
  checkAuth,
  getUserData,
} from "../controllers/auth.controller";

export const router = Router();

import "../config/passport";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  handleGoogleCallback
);

// Login route (email/password)
router.post("/login", login);

// Check authentication status
router.get("/check-auth", checkAuth);

// Get user profile/data
router.get("/user-data", getUserData);

// Logout route
router.get("/logout", logout);

