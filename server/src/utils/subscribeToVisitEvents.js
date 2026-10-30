import redisSubscriber from "../config/redisSubscriber.js";
import { sendDashboardEvent } from "./dashboardEvents.js";

const VISIT_CHANNEL = "converge:visit-recorded";

export const subscribeToVisitEvents = async () => {
    await redisSubscriber.subscribe(VISIT_CHANNEL, (message) => {
        try {
            const event = JSON.parse(message);
            const { userId, linkId, visitedAt } = event;

            if (!userId || !linkId) {
                console.error("Invalid visit event received from Redis");
                return;
            }

            sendDashboardEvent(userId, "visit-recorded", {
                linkId,
                visitedAt,
            });
        } catch (error) {
            console.error("Failed to process visit event:", error.message);
        }
    });

    console.log(`Subscribed to Redis channel: ${VISIT_CHANNEL}`);
};