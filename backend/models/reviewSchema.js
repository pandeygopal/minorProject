import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    revieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: false, // Optional: might just be a general profile review
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        maxLength: [500, "Review cannot exceed 500 characters."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Review = mongoose.model("Review", reviewSchema);
