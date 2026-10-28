import jwt from "jsonwebtoken";
import { success } from "zod";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "Authentication Required",
        });
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    }catch(err){
        return res.status(401).json({
            success:false,
            message: "Invalid or expired token",
        });
    }
};