import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getLinkAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/:id", protect, getLinkAnalytics);

export default router;