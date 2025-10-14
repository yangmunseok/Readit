import LocalStrategy from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import { db } from "../config/db.js";

const { User, Review } = db.models;

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({
            where: { email },
            include: [
              {
                model: Review,
                attributes: ["id"],
                as: "LikedReviews",
                through: { attributes: [] },
              },
            ],
          });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (!result) {
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }
            const { password: _, ...userWithoutPassword } = exUser.toJSON();
            return done(null, userWithoutPassword);
          }
          return done(null, false, { message: "Incorrect email or password." });
        } catch (error) {
          console.error("Local authentication error:", error);
          done(error);
        }
      }
    )
  );
};
