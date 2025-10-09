import { sequelize } from "../config/sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "local",
    },
    snsId: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    searchHistory: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  { timestamps: true, paranoid: true }
);

export default User;
