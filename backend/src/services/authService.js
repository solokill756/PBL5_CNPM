import dotenv from "dotenv";
import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const User = db.users;
dotenv.config();
const generateAccessToken = (user) => {
  const { exp, iat, ...newPayload } = user;
  return jwt.sign(newPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30minutes",
  });
};
const refreshAccessToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return reject(null); // Nếu token không hợp lệ, trả về null
      const accessToken = generateAccessToken(user);
      resolve(accessToken); // Trả về access token mới
    });
  });
};

const deleteToken = (req, res) => {
  res.sendStatus(204);
};
const regiterService = async (user) => {
  try {
    const newUser = await User.create(user);
    return {
      message: "Tạo tài khoản thành công !",
    };
  } catch (error) {
    throw error;
  }
};

const loginService = async (user) => {
  try {
    if (user.username == null) {
      const findUser = await User.findOne({ where: { email: user.email } });
      if (!findUser) {
        return {
          error: "Tài khoản hoặc mât khẩu không đúng",
        };
      } else {
        if (bcrypt.compareSync(user.password, findUser.password)) {
          const payLoad = {
            username: findUser.username,
            email: findUser.email,
            id: findUser.id,
          };
          const accessToken = generateAccessToken(payLoad);
          const refreshToken = jwt.sign(
            payLoad,
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "7days",
            }
          );
          return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              id: findUser.id,
              username: findUser.username,
              email: findUser.email,
              full_name: findUser.full_name,
              datetime_joined: findUser.datetime_joined,
              role: findUser.role,
            },
          };
        } else {
          return {
            error: "Tài khoản hoặc mât khẩu không đúng",
          };
        }
      }
    } else if (user.username) {
      const findUser = await User.findOne({
        where: { username: user.username },
      });
      if (!findUser) {
        return {
          error: "Tài khoản hoặc mât khẩu không đúng",
        };
      } else {
        if (bcrypt.compareSync(user.password, findUser.password)) {
          const payLoad = {
            username: findUser.username,
            email: findUser.email,
            id: findUser.id,
          };
          const accessToken = generateAccessToken(payLoad);
          const refreshToken = jwt.sign(
            payLoad,
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "3days",
            }
          );
          return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              id: findUser.id,
              username: findUser.username,
              email: findUser.email,
              full_name: findUser.full_name,
              datetime_joined: findUser.datetime_joined,
              role: findUser.role,
            },
          };
        } else {
          return {
            error: "Tài khoản hoặc mât khẩu không đúng",
          };
        }
      }
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export { regiterService, loginService, refreshAccessToken };
