import { Router } from "express";
import { router as authRouter } from "./auth.route";
import { router as heroRouter } from "./hero.route";
import { router as aboutRouter } from "./about.route";
import { router as serviceRouter } from "./service.route";
import { router as searchRouter } from "./search.route";
import { router as mediaCentreRouter } from "./mediaCentre.route";
import { router as eventRouter } from "./event.route";
import { router as announcementRouter } from "./announcement.route";
import { router as footerRouter } from "./footer.route";

export const router = Router();

router.use("/auth", authRouter);
router.use("/hero", heroRouter);
router.use("/about", aboutRouter);
router.use("/services", serviceRouter);
router.use("/search", searchRouter);
router.use("/media-centre", mediaCentreRouter);
router.use("/events", eventRouter);
router.use("/announcements", announcementRouter);
router.use("/footer", footerRouter);


