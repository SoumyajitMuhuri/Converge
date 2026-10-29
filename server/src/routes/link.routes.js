import { Router } from "express";
import { createLink, getLinks, deleteLink } from "../controllers/link.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createLink);
router.get("/", protect, getLinks);
router.delete("/:id", protect, deleteLink);

export default router;