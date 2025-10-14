import { configDotenv } from "dotenv";

configDotenv();

export const ENV_VARS = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_DEV_URL: process.env.DB_DEV_URL,
  DB_TEST_URL: process.env.DB_TEST_URL,
  DB_PROD_URL: process.env.DB_PROD_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  LIBRARY_BIGDATA_API_KEY: process.env.LIBRARY_BIGDATA_API_KEY,
  NAVER_API_CLIENT_ID: process.env.NAVER_API_CLIENT_ID,
  NAVER_API_CLIENT_PWD: process.env.NAVER_API_CLIENT_PWD,
  FRONTEND_DEV_URL: process.env.FRONTEND_DEV_URL,
  REDIS_URL: process.env.REDIS_URL,
};
