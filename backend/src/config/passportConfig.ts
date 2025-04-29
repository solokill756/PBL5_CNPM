import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import removeNullProperties from "../utils/removeNullProperties.js";
import {
  generateAccessToken,
  generateRefreshToken,
  saltRounds,
} from "../helpers/tokenHelper.js";
import { registerService, UserPayload } from "../services/authService.js";
import { filterUserData } from "../utils/fillData.js";
import dotenv from "dotenv";
import generateRandomPassword from "../helpers/generatePassword.js";
import db from "../models/index.js";
import bcrypt from "bcrypt";
dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await db.user.findOne({
          where: { email: profile.emails?.[0]?.value },
        });

        if (!user) {
          const userData = removeNullProperties({
            username: profile.name?.familyName ?? "" + profile.name?.givenName,
            full_name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            profile_picture: profile.photos?.[0]?.value || "",
            datetime_joined: Date.now(),
            password: await bcrypt.hash(generateRandomPassword(), saltRounds),
          });
          const newUser = await registerService(userData, 1);
          const userPayload: UserPayload = {
            username: newUser.username,
            email: newUser.email,
            user_id: newUser.user_id,
            tokenVersion: 0,
          };
          return done(null, {
            accessToken: generateAccessToken(userPayload),
            refreshToken: generateRefreshToken(userPayload),
            user: filterUserData(filterUserData(newUser)),
          });
        } else {
          let userData = user.toJSON();
          const payLoad: UserPayload = {
            username: userData.username,
            email: userData.email,
            user_id: userData.user_id,
            tokenVersion: userData.tokenVersion,
          };
          return done(null, {
            accessToken: generateAccessToken(payLoad),
            refreshToken: generateRefreshToken(payLoad),
            user: filterUserData(userData),
          });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
