import "dotenv/config";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Visit from "../models/Visit.js";

const connection = new IORedis(process.env.REDIS_URI,{
    maxRetriesPerRequest: null,
});

const startWorker = async () => {
    await connectDB();

    const worker = new Worker("visit-events", async (job) =>{
        const { linkId, visitedAt } = job.data;

        await Visit.create({
            link: new mongoose.Types.ObjectId(linkId),
            visitedAt: new Date(visitedAt),
        });

        console.log(`Processed visit for link ${linkId}`);
    },{
        connection,
        concurrency: 10,
    }
    );

    worker.on("completed", (job) => {
        console.log(`Visit job ${job.id} completed`);
    })

    worker.on("failed", (job,error) => {
        console.error(`Visit job ${job?.id} failed:`,error.message);
    });

    console.log("Converge visit worker is running");
};

startWorker().catch((error)=>{
    console.error("Failed to start visit worker:",error.message);
    process.exit(1);
});