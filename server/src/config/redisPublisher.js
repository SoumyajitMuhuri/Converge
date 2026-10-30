import { createClient } from "redis";

const redisPublisher = createClient({
    url: process.env.REDIS_URI,
});

redisPublisher.on("error",(error)=>{
    console.error("Redis publisher error:", error.message);
});

export default redisPublisher;
