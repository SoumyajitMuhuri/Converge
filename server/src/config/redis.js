import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URI,
});

redisClient.on("error", (error)=>{
    console.error("Redis error:", error.message);
});

redisClient.on("connect", ()=>{
    console.log("Connecting to Redis...");
});

redisClient.on("ready", ()=>{
    console.log("Redis is ready");
});

export default redisClient;