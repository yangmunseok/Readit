import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { isLoggedIn, isNotLoggedIn } from "../middleware/auth.middleware.js";
import {
  login,
  logout,
  getMe,
  signout,
  signUp,
} from "../controllers/auth.controller.js";
const router = express.Router();
const redirectURL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_DEV_URL;

router.post("/signUp", isNotLoggedIn, signUp, login);
router.post("/login", isNotLoggedIn, login);
router.get("/logout", isLoggedIn, logout);
router.delete("/signout", isLoggedIn, signout);

router.get(
  "/google",
  isNotLoggedIn,
  passport.authenticate("google", { prompt: "select_account" })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/?error=fail",
    successRedirect: redirectURL,
  })
);

router.get("/getMe", isLoggedIn, getMe);
export default router;
