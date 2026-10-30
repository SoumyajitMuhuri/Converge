import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "../config/redis.js";

const createRedisStore = (prefix) => new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix,
});

export const createRateLimiters = () => {

    //Max 10 login attempts in 15mins from same IP
    const loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 10,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        store: createRedisStore("rl:login"),
        message: {
            success: false,
            message: "Too many login attempts. Try again after 15 minutes",
        },
    });

    //Max 10 registration attempts in 1hr from same IP

    const registerLimiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        limit: 10,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        store: createRedisStore("rl:register"),
        message: {
            success: false,
            message: "Too many registration attempts. Try again after 60 mins",
        },
    });

    //Max 20 link creation attempts per authenticated user in 1hr.
    const createLinkLimiter = rateLimit({
        windowMs: 60 * 60 * 1000,
        limit: 20,
        keyGenerator: (req) => req.userId,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        store: createRedisStore("rl:create-link:"),
        message: {
            success: false,
            message: "Link creation limit reached. Please try again later.",
        },
    });
    return { loginLimiter, registerLimiter, createLinkLimiter };
};
