import { sequelize } from "../config/sequelize.js";

const ReviewLiker = sequelize.define("ReviewLiker", {}, { timestamps: false });

export default ReviewLiker;
