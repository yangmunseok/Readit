import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import {
  deleteReview,
  getReviews,
  LikeUnlikeReview,
  postReview,
  updateReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/postReview", isLoggedIn, postReview);
router.get("/getReviews/:bookId", isLoggedIn, getReviews);
router.delete("/deleteReview/:reviewId", isLoggedIn, deleteReview);
router.patch("/updateReview/:reviewId", isLoggedIn, updateReview);
router.post("/likeUnlikeReview/:reviewId", isLoggedIn, LikeUnlikeReview);

export default router;
