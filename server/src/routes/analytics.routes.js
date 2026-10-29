import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getLinkAnalytics, getDashboardAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/dashboard", protect, getDashboardAnalytics);
router.get("/:id", protect, getLinkAnalytics);

export default router;