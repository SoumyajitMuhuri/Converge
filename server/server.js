import "dotenv/config"
import createApp from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import redisClient from "./src/config/redis.js";
import redisPublisher from "./src/config/redisPublisher.js";
import redisSubscriber from "./src/config/redisSubscriber.js";
import { subscribeToVisitEvents } from "./src/utils/subscribeToVisitEvents.js";
import { startVisitWorker } from "./src/workers/visit.worker.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        await redisClient.connect();
        await redisPublisher.connect();
        await redisSubscriber.connect();

        await subscribeToVisitEvents();
        await startVisitWorker();

        const app = createApp();

        app.listen(PORT, () => {
            console.log(`Converge server is running`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

// For local development
if (process.env.NODE_ENV !== "production") {
    startServer();
}

// For Vercel serverless - export the app
const app = createApp();

// Initialize connections lazily for serverless
let initialized = false;
const initializeConnections = async () => {
    if (!initialized) {
        try {
            await connectDB();
            if (!redisClient.isOpen) await redisClient.connect();
            if (!redisPublisher.isOpen) await redisPublisher.connect();
            if (!redisSubscriber.isOpen) await redisSubscriber.connect();
            initialized = true;
        } catch (error) {
            console.error("Failed to initialize connections:", error.message);
        }
    }
};

// Middleware to ensure connections are initialized
app.use(async (req, res, next) => {
    await initializeConnections();
    next();
});

export default app;