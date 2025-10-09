import passport from "passport";
import google from "../strategies/googleStrategy.js";
import local from "../strategies/localStrategy.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        include: [
          {
            model: Review,
            attributes: ["id"],
            as: "LikedReviews",
            through: { attributes: [] },
          },
        ],
      });
      const { password, ...userWithoutPassword } = user.toJSON();
      done(null, userWithoutPassword);
    } catch (err) {
      done(err);
    }
  });

  local();
  google();
};
