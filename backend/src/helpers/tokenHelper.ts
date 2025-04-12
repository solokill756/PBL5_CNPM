import dotenv from "dotenv";
import db from "../models/index.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
dotenv.config();

const User = db.users;

interface UserPayload {
  username: string;
  email: string;
  id: number;
  tokenVersion?: number;
}

const saltRounds = 10;

const generateAccessToken = (user: UserPayload): string => {
  const { ...newPayload } = user;
  return jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "30m",
  });
};
const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

const refreshAccessToken = (refreshToken: string): Promise<string | null> => {
  return new Promise((resolve) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, async (err, decoded) => {
      if (err || !decoded) return resolve(null);

      const user = await User.findOne({ where: { id: (decoded as UserPayload).id } });
      if (!user || user.tokenVersion !== (decoded as UserPayload).tokenVersion) {
        return resolve(null);
      }

      const accessToken = generateAccessToken(decoded as UserPayload);
      resolve(accessToken);
    });
  });
};

const deleteToken = (_req: Request, res: Response): void => {
  res.clearCookie("refreshToken");
  res.sendStatus(204);
};

export {generateAccessToken , refreshAccessToken , generateRefreshToken , deleteToken , saltRounds }