import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

export const createAuthRoutes = ({ loginLimiter, registerLimiter }) => {
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/me", protect, getMe);

return router
}
