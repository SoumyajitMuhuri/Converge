import {
    addDashboardClient,
    removeDashboardClient,
} from "../utils/dashboardEvents.js";

export const subscribeToDashboardEvents = (req, res) => {
    // SSE doesn't work well in serverless - return a message
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
        return res.status(501).json({
            success: false,
            message: "Real-time dashboard events not available in serverless mode. Use polling instead."
        });
    }

    const userId = req.userId;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.flushHeaders("Connection", "keep-alive");

    res.write("event: connection\ndata: {}\n\n");

    addDashboardClient(userId, res);

    req.on("close", ()=>{
        removeDashboardClient(userId, res);
    });
};