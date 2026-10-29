import { Router } from "express";
import { createLink } from "../controllers/link.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createLink);

export default router;