import { createClient } from "redis";

const redisPublisher = createClient({
    url: process.env.REDIS_URI,
});

redisPublisher.on("error",(error)=>{
    console.error("Redis publisher error:", error.message);
});

process.on("SIGINT", async () => {
    if (redisPublisher.isOpen) {
        await redisPublisher.quit();
    }
    process.exit(0);
});

export default redisPublisher;