import { Router } from "express";
import { router as authRouter } from "./auth.route";
import { router as heroRouter } from "./hero.route";
import { router as aboutRouter } from "./about.route";
import { router as serviceRouter } from "./service.route";
import { router as searchRouter } from "./search.route";

export const router = Router();

router.use("/auth", authRouter);
router.use("/hero", heroRouter);
router.use("/about", aboutRouter);
router.use("/services", serviceRouter);
router.use("/search", searchRouter);


