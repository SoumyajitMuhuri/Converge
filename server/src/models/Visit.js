import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
    {
        link: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Link",
            required: true,
        },
        visitedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    { timestamps: true }
);

visitSchema.index({ link: 1, visitedAt: -1 });

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
