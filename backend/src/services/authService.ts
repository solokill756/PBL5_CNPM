import dotenv from "dotenv";
import db from "../models/index.js";
import bcrypt from "bcrypt";
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

const registerService = async (user: any): Promise<{ message: string }> => {
  try {
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({ ...user, tokenVersion: 0 });
    console.log(newUser);
    return {
      message: "Tạo tài khoản thành công!",
    };
  } catch (error) {
    throw error;
  }
};

const logOutService = async (req: Request, res: Response): Promise<{ message: string }> => {
  try {
    const userId = (req.body.user as UserPayload).id;
    await User.update({ tokenVersion: db.sequelize.literal("tokenVersion + 1") }, { where: { id: userId } });
    deleteToken(req, res);
    return { message: "Đăng xuất thành công!" };
  } catch (error) {
    throw error;
  }
};

const loginService = async (user: { email?: string; username?: string; password: string }): Promise<any> => {
  try {
    const findUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email: user.email }, { username: user.username }],
      },
    });

    if (!findUser || !bcrypt.compareSync(user.password, findUser.password)) {
      return { error: "Tài khoản hoặc mật khẩu không đúng" };
    }

    const payLoad: UserPayload = {
      username: findUser.username,
      email: findUser.email,
      id: findUser.id,
      tokenVersion: findUser.tokenVersion,
    };

    const accessToken = generateAccessToken(payLoad);
    const refreshToken = generateRefreshToken(payLoad);

    return {
      accessToken,
      refreshToken,
      user: {
        id: findUser.id,
        username: findUser.username,
        email: findUser.email,
        full_name: findUser.full_name,
        datetime_joined: findUser.datetime_joined,
        role: findUser.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

export { registerService, loginService, refreshAccessToken, logOutService };
