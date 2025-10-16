import express from "express";

import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import path from "path";

import { ENV_VARS } from "./config/envVars.js";
import { db } from "./config/db.js";
import { sequelize } from "./config/sequelize.js";
import passportConfig from "./config/passport.js";

import { cleanupInterval, cleanupOldUsers } from "./jobs/cleanup.js";

import authRouter from "./routes/auth.route.js";
import reviewRouter from "./routes/review.route.js";
import bookRouter from "./routes/book.route.js";

const app = express();
const port = ENV_VARS.PORT || 8000;
const secret_key = ENV_VARS.COOKIE_SECRET || "";
const lifeTime = 1 * 60 * 60 * 1000; // 1 hour
const __dirname = path.resolve();

db.associate();
sequelize.sync();
passportConfig();

app.enable("trust proxy");

app.use(logger("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secret_key));

if (ENV_VARS.NODE_ENV === "production") {
  const { connectRedis } = await import("./config/redis.js");
  const { RedisStore } = await import("connect-redis");
  const redisClient = await connectRedis();
  app.use(
    session({
      secret: secret_key,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: lifeTime,
        sameSite: "lax",
      },
      store: new RedisStore({ client: redisClient }),
    })
  );
} else {
  app.use(
    session({
      secret: secret_key,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: lifeTime,
        sameSite: "lax",
      },
    })
  );
}

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/book", bookRouter);

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  cleanupOldUsers();
  setInterval(cleanupOldUsers, cleanupInterval);
  console.log(`Server is running on port ${port}`);
});
