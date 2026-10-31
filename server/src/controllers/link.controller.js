import { z } from "zod";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import Link from "../models/Link.js";
import redisClient from "../config/redis.js";
import visitQueue from "../queues/visit.queue.js";
import { generateQr } from "../utils/generateQr.js";
import Visit from "../models/Visit.js";

const createLinkSchema = z.object({
    originalUrl: z.url().trim().max(2048).refine((value) => {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
    }, "Only HTTP/HTTPS URLs are allowed"),

    customAlias: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),

    expiresAt: z.iso.datetime().optional(),
});

export const createLink = async (req, res) => {
    try {
        const parsed = createLinkSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid Link",
                errors: parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const { originalUrl, customAlias, expiresAt } = parsed.data;

        if (expiresAt && new Date(expiresAt) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Expiration date must be in the future",
            });
        }

        const shortCode = customAlias || randomBytes(5).toString("base64url");

        const existingLink = await Link.exists({ shortCode });

        if (existingLink) {
            return res.status(409).json({
                success: false,
                message: "This alias is already taken",
            });
        }

        const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`;
        const shortUrl = `${baseUrl}/${shortCode}`;

        const qrCodeUrl = await generateQr(shortUrl, shortCode);

        const link = await Link.create({
            originalUrl,
            shortCode,
            user: req.userId,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            qrCodeUrl,
        });

        return res.status(200).json({
            success: true,
            link: {
                id: link._id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                shortUrl: `${baseUrl}/${link.shortCode}`,
                qrCodeUrl: link.qrCodeUrl,
                expiresAt: link.expiresAt,
                createdAt: link.createdAt,
            },
        });
    } catch (err) {

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "This alias is already taken",
            });
        }
        console.error("Link creation error", err.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

//redis

export const redirectToOriginalUrl = async (req, res) => {
    try {
        const { code } = req.params;
        const cacheKey = `link:${code}`;
        let linkData;

        // Redis caching
        if (redisClient.isReady) {
            try {
                const cachedLink = await redisClient.get(cacheKey);
                if (cachedLink) {
                    const parsedLink = JSON.parse(cachedLink);
                    // Older cached records may not contain the Mongo ID needed by
                    // the visit worker. Treat those as cache misses and refresh.
                    if (parsedLink.linkId) {
                        linkData = parsedLink;
                    } else {
                        await redisClient.del(cacheKey);
                    }
                }
            } catch (err) {
                console.error("Redis cache read failed:", err.message);
            }
        }

        if (!linkData) {
            const linkRecord = await Link.findOne({ shortCode: code });

            if (!linkRecord) {
                return res.status(404).json({
                    success: false,
                    message: "URL not found",
                });
            }

            linkData = {
                linkId: linkRecord._id.toString(),
                originalUrl: linkRecord.originalUrl,
                expiresAt: linkRecord.expiresAt,
            };

            const maxCacheTtlSeconds = 24 * 60 * 60;
            const ttlSeconds = linkData.expiresAt
                ? Math.min(
                    maxCacheTtlSeconds,
                    Math.floor((new Date(linkData.expiresAt).getTime() - Date.now()) / 1000)
                )
                : maxCacheTtlSeconds;

            if (redisClient.isReady && ttlSeconds > 0) {
                try {
                    await redisClient.set(cacheKey, JSON.stringify(linkData), { EX: ttlSeconds });
                } catch (err) {
                    console.error("Redis cache write failed:", err.message);
                }
            }
        }

        if (linkData.expiresAt && new Date(linkData.expiresAt) <= new Date()) {
            if (redisClient.isReady) {
                try {
                    await redisClient.del(cacheKey);
                } catch (err) {
                    console.error("Redis cache delete failed:", err.message);
                }
            }

            return res.status(410).json({
                success: false,
                message: "Link has expired",
            });
        }

        visitQueue.add("record-visit", {
            linkId: linkData.linkId,
            visitedAt: new Date().toISOString(),
        },
            {
                attempts: 5,
                backoff: {
                    type: "exponential",
                    delay: 1000,
                },
                removeOnComplete: 1000,
                removeOnFail: 500,
            }
        ).catch((error) => {
            console.error("Failed to queue visit:", error.message);
        });

        return res.redirect(302, linkData.originalUrl);

    }

    catch (err) {
        console.error("Redirect error:", err.message);

        return res.status(500).send("Internal server error");
    }
};

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    const linkIds = links.map((link) => link._id);

    const visitCounts = await Visit.aggregate([
      { $match: { link: { $in: linkIds } } },
      {
        $group: {
          _id: "$link",
          visits: { $sum: 1 },
        },
      },
    ]);

    const visitCountMap = new Map(
      visitCounts.map((item) => [item._id.toString(), item.visits]),
    );

    const baseUrl =
      process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      count: links.length,
      links: links.map((link) => ({
        id: link._id,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        shortUrl: `${baseUrl}/${link.shortCode}`,
        qrCodeUrl: link.qrCodeUrl,
        expiresAt: link.expiresAt,
        createdAt: link.createdAt,
        visits: visitCountMap.get(link._id.toString()) ?? 0,
      })),
    });
  } catch (error) {
    console.error("Get links error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const downloadQrCode = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid link ID",
        });
    }

    try {
        const link = await Link.findOne({
            _id: id,
            user: req.userId,
        }).select("qrCodeUrl shortCode");

        if (!link?.qrCodeUrl) {
            return res.status(404).json({
                success: false,
                message: "QR code not found",
            });
        }

        const imageUrl = new URL(link.qrCodeUrl);
        if (imageUrl.protocol !== "https:") {
            return res.status(502).json({
                success: false,
                message: "QR code image is unavailable",
            });
        }

        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            return res.status(502).json({
                success: false,
                message: "Unable to retrieve the QR code image",
            });
        }

        const contentType = imageResponse.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) {
            return res.status(502).json({
                success: false,
                message: "The QR code URL did not return an image",
            });
        }

        const image = Buffer.from(await imageResponse.arrayBuffer());
        const safeShortCode = link.shortCode.replace(/[^a-zA-Z0-9_-]/g, "") || "qr-code";

        res.set({
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="converge-${safeShortCode}.png"`,
            "Cache-Control": "private, no-store",
        });

        return res.status(200).send(image);
    } catch (error) {
        console.error("QR code download error:", error.message);
        return res.status(502).json({
            success: false,
            message: "Unable to download the QR code",
        });
    }
};


export const deleteLink = async (req, res) => {
    try {
        const link = await Link.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found",
            });
        }

        // 1. Delete the cached redirect from Redis.
        if (redisClient.isReady) {
            await redisClient.del(`link:${link.shortCode}`);
        }
        // 2. Delete the link from MongoDB.
        await Link.deleteOne({
            _id: link._id,
            user: req.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Link deleted successfully",
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid link ID",
            });
        }

        console.error("Delete link error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete link",
        });
    }
};
