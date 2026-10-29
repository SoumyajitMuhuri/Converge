import express from "express";
import cors from "cors";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createLinkRoutes } from "./routes/link.routes.js";
import { redirectToOriginalUrl } from "./controllers/link.controller.js";
import { createRateLimiters } from "./middleware/rateLimit.middleware.js";
import analyticsRoutes from "./routes/analytics.routes.js"

export const createApp = () => {

    const app = express();
    const { loginLimiter, registerLimiter, createLinkLimiter } = createRateLimiters();

    app.use(cors({
        origin: process.env.CLIENT_URL,
    }));

    app.use(express.json({ limit: "10kb" }));

    app.get("/api/health", (req, res) => {
        res.status(200).json({
            success: true,
            message: "Converge API is running",
        });
    });

    app.use("/api/auth", createAuthRoutes({ loginLimiter, registerLimiter }));
    app.use("/api/links", createLinkRoutes({ createLinkLimiter }));
    app.use("/api/analytics", analyticsRoutes);
    app.get("/:code", redirectToOriginalUrl);

    return app;
};