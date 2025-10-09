import { sequelize } from "../config/sequelize.js";
import { DataTypes } from "sequelize";

const Review = sequelize.define(
  "Review",
  {
    content: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    bookId: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { timestamps: true, paranoid: true }
);

export default Review;
