import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/user.js";

const registerSchema = z.object({
    name: z.string().trim().min(2).max(80),
    email: z.email().trim().max(254),
    password: z.string().min(8).max(20),
});

const loginSchema = z.object({
    email: z.email().trim().max(254),
    password: z.string().min(1).max(20),
});

const createToken = (userId) => {
    return jwt.sign(
        {userId : userId.toString()},
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export const register = async (req,res) => {
    try{
        const parsed = registerSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message: "Invalid registration details",
                errors: parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const { name, email, password } = parsed.data;
        const normalizedEmail= email.toLowerCase();

        const existingUser = await User.exists({
            email: normalizedEmail,
        });

        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "Cannot register with these credentials",
            });
        }

        //password hashing

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        const token = createToken(user._id);

        return res.status(201).json({
            success: true,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch(err){
        // The unique index is the final guard against concurrent registrations.
        if (err?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Cannot register with these credentials",
            });
        }

        console.error("Error in registration:",err.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const login = async (req,res) => {
    try{
        const parsed = loginSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                message:"Invalid credentials",
            });
        }

        const {email, password} = parsed.data;

        const user= await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = createToken(user._id);

        return res.status(200).json({
            success: true,
            token,
            user:{
            name: user.name,
            email: user.email,
        },
    });
} catch(err){
    console.error("Login error:",err.message);

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
};

export const getMe = async (req,res) => {
    try{
        const user = await User.findById(req.userId).select(
            "name email createdAt"
        );

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        return res.status(200).json({
            success: true,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch(err){
        console.log("Profile error",err.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
