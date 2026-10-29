import { success, z } from "zod";
import { randomBytes } from "node:crypto";
import Link from "../models/link.js";

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

        const link = await Link.create({
            originalUrl,
            shortCode,
            user: req.userId,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        });

        const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`;

        return res.status(200).json({
            success: true,
            link: {
                id: link._id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                shortUrl: `${baseUrl}/${link.shortCode}`,
                expiresAt: link.expiresAt,
                createdAt: link.createdAt,
            },
        });
    } catch (err) {
        console.error("Link creation error", err.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const redirectToOriginalUrl = async (req, res) => {
    try {
        const link = await Link.findOne({
            shortCode: req.params.code,
        });

        if (!link) {
            return res.status(404).send("Short URL not found");
        }

        if (link.expiresAt && link.expiresAt <= new Date()) {
            return res.status(410).send("This short link has expired");
        }

        return res.redirect(302, link.originalUrl);
    }
    catch (err) {
        console.error("Redirect error:", err.message);

        return res.status(500).send("Internal server error");
    }
};

export const getLinks = async (req, res) => {
    try {
        const links = await Link.find({
            user: req.userId
        }).sort({ createdAt: -1 });

        const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get("host")}`;

        return res.status(200).json({
            success: true,
            count: links.length,
            links: links.map((link) => ({
                id: link._id,
                originalUrl: link.originalUrl,
                shortCode: link.shortCode,
                shortUrl: `${baseUrl}/${link.shortCode}`,
                expiresAt: link.expiresAt,
                createdAt: link.createdAt,
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

export const deleteLink = async (req, res) => {
    try {
        const link = await Link.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Link not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Link deleted successfully",
        });
    } catch (error) {
        console.error("Delete link error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};