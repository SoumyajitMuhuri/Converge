import {
    addDashboardClient,
    removeDashboardClient,
} from "../utils/dashboardEvents.js";

export const subscribeToDashboardEvents = (req, res) => {
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
