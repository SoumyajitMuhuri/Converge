import { createClient } from "redis";

const redisSubscriber = createClient({
    url: process.env.REDIS_URI,
});

redisSubscriber.on("error",(error)=>{
    console.error("Redis subscriber error:", error.message);
});

export default redisSubscriber;