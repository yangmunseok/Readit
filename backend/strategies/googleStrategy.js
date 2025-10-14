import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import { ENV_VARS } from "../config/envVars.js";
import { db } from "../config/db.js";

const { User, Review } = db.models;

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV_VARS.GOOGLE_CLIENT_ID,
        clientSecret: ENV_VARS.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
        state: true,
        proxy: true,
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
