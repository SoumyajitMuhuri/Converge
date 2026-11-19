import { Queue } from "bullmq";
import IORedis from "ioredis";

const isServerless = process.env.VERCEL || process.env.NODE_ENV === "production";

let connection = null;
let visitQueue = null;

if (!isServerless) {
    connection = new IORedis(process.env.REDIS_URI, {
        maxRetriesPerRequest: null,
    });

    visitQueue = new Queue("visit-events", {
        connection,
    });
}

// Mock queue for serverless - visits will be processed asynchronously
const mockQueue = {
    add: async (name, data, options) => {
        console.log(`Mock queue: ${name}`, data);
        // In serverless, we can't use bullmq workers, so we log the visit
        // A separate worker process should be running to process the actual queue
        return { id: `mock-${Date.now()}` };
    }
};

export const visitQueue = visitQueue || mockQueue;

export default visitQueue;