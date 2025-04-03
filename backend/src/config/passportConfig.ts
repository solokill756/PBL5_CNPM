import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../models/index.js";
import removeNullProperties from "../helpers/removeNullProperties.js";
import { generateAccessToken, generateRefreshToken  } from "../helpers/tokenHelper.js";
import {  UserPayload } from "../services/authService.js";
import { filterUserData } from "../helpers/fillData.js";
import dotenv from "dotenv";
const User =db.users;
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
        let user = await User.findOne({email : profile.emails?.[0]?.value});
        let userData = user.toJSON();
        console.log(filterUserData(userData));
        if(!userData) {
            userData = removeNullProperties ({
            username: profile.username,
            full_name: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            profile_picture : profile.photos?.[0]?.value || "",
            datetime_joined: Date.now(),
          });
          await User.create({ ...user, tokenVersion: 0 });
          return done(null , {accessToken : generateAccessToken({...userData , tokenVersion: 0} as UserPayload) , refreshToken : generateRefreshToken({...userData , tokenVersion: 0} as UserPayload) , user : filterUserData(userData)});
        }
        else {
          return done(null , {accessToken : generateAccessToken({...userData , tokenVersion: 0} as UserPayload) , refreshToken : generateRefreshToken({...userData , tokenVersion: 0} as UserPayload) , user :filterUserData(userData)});
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

