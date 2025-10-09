import User from "../models/user.model.js";
import passport from "passport";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const signUp = async (req, res, next) => {
  const { email, password, nickname } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const exUser = await User.findOne({
      where: { [Op.or]: [{ email }, { nickname }] },
    });
    if (exUser) {
      return res.status(409).send({
        error:
          "This email or nickname has already been registered. Please try another one.",
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters long" });
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({ email, nickname, password: hash });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(401).send({ error: info.message });
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.status(200).json(req.user);
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout(() => {
    res.status(200).send({ message: "Logged out successfully" });
  });
};

export const signout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    req.logout(() => {
      res.status(200).json({ message: "User account deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the account" });
  }
};

export const getMe = (req, res) => {
  res.status(200).json(req.user);
};
