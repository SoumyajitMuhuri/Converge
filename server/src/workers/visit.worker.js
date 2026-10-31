import "dotenv/config";
import { pathToFileURL } from "node:url";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import { createClient } from "redis";
import { connectDB } from "../config/db.js";
import Visit from "../models/Visit.js";
import Link from "../models/Link.js";

const connection = new IORedis(process.env.REDIS_URI, {
    maxRetriesPerRequest: null,
});

const eventPublisher = createClient({
    url: process.env.REDIS_URI,
});

eventPublisher.on("error", (error) => {
    console.error("Visit event publisher error:", error.message);
});

export const startVisitWorker = async () => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    if (!eventPublisher.isOpen) {
        await eventPublisher.connect();
    }

    const worker = new Worker(
        "visit-events",
        async (job) => {
            const { linkId, visitedAt } = job.data;

            // 1. Save the visit to MongoDB.
            const visit = await Visit.create({
                link: new mongoose.Types.ObjectId(linkId),
                visitedAt: new Date(visitedAt),
            });

            // 2. Find the owner of the shortened link.
            const link = await Link.findById(linkId)
                .select("user")
                .lean();

            // 3. Notify the Express server through Redis Pub/Sub.
            if (link) {
                await eventPublisher.publish(
                    "converge:visit-recorded",
                    JSON.stringify({
                        userId: link.user.toString(),
                        linkId: linkId.toString(),
                        visitedAt: visit.visitedAt.toISOString(),
                    }),
                );
            }

            console.log(`Processed visit for link ${linkId}`);
        },
        {
            connection,
            concurrency: 10,
        },
    );

    worker.on("completed", (job) => {
        console.log(`Visit job ${job.id} completed`);
    });

    worker.on("failed", (job, error) => {
        console.error(`Visit job ${job?.id} failed:`, error.message);
    });
    worker.on("error", (error) => {
        console.error("Visit worker error:", error.message);
    });

    console.log("Converge visit worker is running");
    return worker;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    startVisitWorker().catch((error) => {
        console.error("Failed to start visit worker:", error.message);
        process.exit(1);
    });
}
