import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import ReviewLiker from "../models/reviewLiker.model.js";

export const postReview = async (req, res) => {
  try {
    const { content, bookId, rating } = req.body;

    if (!content || !bookId || !rating) {
      return res.status(400).json({ error: "complete your parameters" });
    }
    const userId = req.user.id;

    const review = await Review.create({
      content,
      bookId,
      rating,
      reviewer: userId,
    });
    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ["nickname"] }],
    });
    res.status(201).json(fullReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to post review" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const reviews = await Review.findAll({
      attributes: ["id", "content", "rating", "bookId", "likes"],
      where: { bookId },
      include: [{ model: User, attributes: ["nickname"] }],
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve reviews" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const review = await Review.findOne({ where: { id: reviewId } });

    if (review.reviewer !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await Review.destroy({ where: { id: reviewId } });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { content, rating } = req.body;
    const userId = req.user.id;

    const updatedData = {};
    if (content) updatedData.content = content;
    if (rating) updatedData.rating = rating;

    const review = await Review.findOne({ where: { id: reviewId } });

    if (review.reviewer !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await review.update(updatedData);

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

export const LikeUnlikeReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const review = await Review.findOne({ where: { id: reviewId } });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const existingLike = await ReviewLiker.findOne({
      where: { userId, reviewId },
    });

    if (existingLike) {
      await existingLike.destroy();
      const updatedData = { likes: review.likes - 1 };
      review.update(updatedData);
      return res.status(200).json({ message: "Review unliked" });
    }

    await ReviewLiker.create({ userId, reviewId });
    const updatedData = { likes: review.likes + 1 };
    review.update(updatedData);
    res.status(201).json({ message: "Review liked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like/unlike review" });
  }
};
