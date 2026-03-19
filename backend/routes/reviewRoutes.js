import express from "express";
import { postReview, getUserReviews } from "../controllers/reviewController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postReview);
router.get("/:id", getUserReviews);

export default router;
