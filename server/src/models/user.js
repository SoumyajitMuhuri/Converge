import mongoose from "mongoose";
import { email, lowercase, maxLength } from "zod";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 80,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
    },
    {timestamps: true}
);

const User = mongoose.model("User",userSchema);

export default User;