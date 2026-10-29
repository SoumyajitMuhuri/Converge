import mongoose, { mongo } from "mongoose"
import { maxLength } from "zod"

const linkSchema = new mongoose.Schema(
    {
        originalUrl:{
            type: String,
            required: true,
            trim: true,
            maxLength: 2048,
        },

        shortCode:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
            index: true,
        },

        expiresAt:{
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Link = mongoose.model("Link", linkSchema);

export default Link;

