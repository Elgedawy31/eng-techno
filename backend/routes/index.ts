import { Router } from "express";
import { router as authRouter } from "./auth.route";
import { router as heroRouter } from "./hero.route";

export const router = Router();

router.use("/auth", authRouter);
router.use("/hero", heroRouter);


