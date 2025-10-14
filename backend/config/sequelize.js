import { Sequelize } from "sequelize";
import { ENV_VARS } from "./envVars.js";

let sequelize;

try {
  const env = ENV_VARS.NODE_ENV || "development";
  switch (env) {
    case "development":
      sequelize = new Sequelize(ENV_VARS.DB_DEV_URL, {
        underscored: true,
      });
      break;
    case "production":
      sequelize = new Sequelize(ENV_VARS.DB_PROD_URL, {
        underscored: true,
      });
      break;
    case "test":
      sequelize = new Sequelize(ENV_VARS.DB_TEST_URL, {
        underscored: true,
      });
  }
  console.log("Sequelize connection established successfully.");
} catch (error) {
  console.error("Unable to connect Sequelize:", error);
}

export { sequelize };
