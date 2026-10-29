import {Queue} from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URI,{
    maxRetriesPerRequest: null,
});

export const visitQueue = new Queue("visit-events",{
    connection,
});

export default visitQueue;