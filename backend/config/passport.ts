import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/user.model";
import { env } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
          return done(new Error("Email not provided by Google"), false);
        }

        let user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
          user = await UserModel.create({
            name,
            email: email.toLowerCase(),
            role: "user",
          });
        }

        return done(null, user as any);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id).select("_id email role");
    if (!user) {
      return done(null, false);
    }
    done(null, user as any);
  } catch (error) {
    done(error, false);
  }
});

