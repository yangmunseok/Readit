import { Sequelize } from "sequelize";
import { configDotenv } from "dotenv";

configDotenv();
let sequelize;

try {
  const env = process.env.NODE_ENV || "development";
  switch (env) {
    case "development":
      sequelize = new Sequelize(process.env.DB_DEV_URL, {
        underscored: true,
      });
      break;
    case "production":
      sequelize = new Sequelize(process.env.DB_PROD_URL, {
        underscored: true,
      });
      break;
    case "test":
      sequelize = new Sequelize(process.env.DB_TEST_URL, {
        underscored: true,
      });
  }
  console.log("Sequelize connection established successfully.");
} catch (error) {
  console.error("Unable to connect Sequelize:", error);
}

export { sequelize };
