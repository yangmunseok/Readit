import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import ReviewLiker from "../models/reviewLiker.model.js";
import { sequelize } from "./sequelize.js";

User.hasMany(Review, { foreignKey: "reviewer", sourceKey: "id" });
Review.belongsTo(User, { foreignKey: "reviewer", targetKey: "id" });
User.belongsToMany(Review, {
  through: ReviewLiker,
  as: "LikedReviews",
  foreignKey: "userId",
});
Review.belongsToMany(User, {
  through: ReviewLiker,
  as: "Likers",
  foreignKey: "reviewId",
  onDelete: "CASCADE",
});

sequelize.sync();
