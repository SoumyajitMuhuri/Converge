import { createClient } from "redis";

const redisSubscriber = createClient({
    url: process.env.REDIS_URI,
});

redisSubscriber.on("error",(error)=>{
    console.error("Redis subscriber error:", error.message);
});

process.on("SIGINT", async () => {
    if (redisSubscriber.isOpen) {
        await redisSubscriber.quit();
    }
    process.exit(0);
});

export default redisSubscriber;