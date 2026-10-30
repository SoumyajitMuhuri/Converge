import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getLinkAnalytics, getDashboardAnalytics } from "../controllers/analytics.controller.js";
import { subscribeToDashboardEvents } from "../controllers/dashboardEvents.controller.js";

const router = Router();

router.get("/dashboard", protect, getDashboardAnalytics);
router.get("/events", protect, subscribeToDashboardEvents);
router.get("/:id", protect, getLinkAnalytics);

export default router;