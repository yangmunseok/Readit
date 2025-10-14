import { createClient } from "redis";
import { ENV_VARS } from "./envVars.js";

const redisClient = createClient({
  url: ENV_VARS.REDIS_URL,
});

redisClient.on("error", function (err) {
  throw err;
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected");
    }
    return redisClient;
  } catch (error) {
    console.error("Redis Connection failed:", error);
  }
};
