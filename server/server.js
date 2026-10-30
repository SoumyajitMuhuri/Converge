import "dotenv/config"
import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import redisClient from "./src/config/redis.js";
import redisPublisher from "./src/config/redisPublisher.js";
import redisSubscriber from "./src/config/redisSubscriber.js";
import { subscribeToVisitEvents } from "./src/utils/subscribeToVisitEvents.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        await redisClient.connect();
        await redisPublisher.connect();
        await redisSubscriber.connect();

        await subscribeToVisitEvents();

        const app = createApp();

        app.listen(PORT, () => {
            console.log(`Converge server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();