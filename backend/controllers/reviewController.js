import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Review } from "../models/reviewSchema.js";

export const postReview = catchAsyncErrors(async (req, res, next) => {
  const { revieweeId, jobId, rating, comment } = req.body;
  
  if (!revieweeId || !rating) {
    return next(new ErrorHandler("Reviewee ID and rating are required.", 400));
  }

  // Optional: Prevent duplicate reviews for same job
  if (jobId) {
    const existingReview = await Review.findOne({ reviewerId: req.user._id, jobId });
    if (existingReview) {
      return next(new ErrorHandler("You have already reviewed this job.", 400));
    }
  }

  const review = await Review.create({
    reviewerId: req.user._id,
    revieweeId,
    jobId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully!",
    review,
  });
});

export const getUserReviews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const reviews = await Review.find({ revieweeId: id }).populate("reviewerId", "name role");

  res.status(200).json({
    success: true,
    reviews,
  });
});
