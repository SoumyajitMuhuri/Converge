import { Router } from "express";
import { createLink, getLinks, deleteLink, downloadQrCode } from "../controllers/link.controller.js";
import { protect } from "../middleware/auth.middleware.js";
export const createLinkRoutes = ({ createLinkLimiter }) => {
    const router = Router();

    router.post("/", protect, createLinkLimiter, createLink);
    router.get("/", protect, getLinks);
    router.get("/:id/qr/download", protect, downloadQrCode);
    router.delete("/:id", protect, deleteLink);

    return router;
};
