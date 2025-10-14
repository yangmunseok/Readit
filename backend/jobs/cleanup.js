import { Op } from "sequelize";
import { db } from "../config/db.js";

const { User } = db.models;
const retentionPeriod = 60 * 1000 * 60 * 24 * 7; // 7days
export const cleanupInterval = 60 * 1000 * 60 * 24 * 7; // 7days

export const cleanupOldUsers = async () => {
  try {
    await User.destroy({
      where: { deletedAt: { [Op.lt]: new Date(Date.now() - retentionPeriod) } },
      force: true,
      paranoid: false,
    });
  } catch (error) {
    console.error("Error cleaning up old users:", error);
  }
};
