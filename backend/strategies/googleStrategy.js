import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        // Find or create user in your database
        try {
          console.log(profile);
          const exUser = await User.findOne({
            where: { email: profile.emails[0].value, provider: "google" },
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
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile.emails[0].value,
              nickname: profile.displayName,
              provider: "google",
              snsId: profile.id,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error("Google OAuth error:", error);
          done(error);
        }
      }
    )
  );
};
