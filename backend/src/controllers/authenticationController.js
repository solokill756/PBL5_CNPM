import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../models/index.js";
import { regiterService } from "../services/authService.js";
dotenv.config();

const User = db.users;
let refreshTokens = [];

// Đăng nhập, tạo token

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "150s" });
};
const createToken = (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null)
    return res.status(401).send("Invalid refresh token");
  if (!refreshTokens.includes(refreshToken))
    return res.status(403).send("Invalid refresh token");
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token");
    const accessToken = generateAccessToken(user);
    return res.status(200).json({ token: accessToken });
  });
};

const deleteToken = (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
};
const login = (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(400).json({ error: "Thiếu username" });
  }

  const user = { username: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res
    .status(200)
    .json({ accessToken: accessToken, refreshToken: refreshToken });
};

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Thiếu token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token không hợp lệ" });
    }
    req.user = user;
    next();
  });
};

// API lấy thông tin user
const getUserID = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.user.username } });

    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy user" });
    }

    res.status(200).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Register
const regiter = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      fullname: req.body.fullname,
      email: req.body.email,
      datetime_joined: Date.now(),
    };
    regiterService(user).then((response) => {
      res.status(200).json(response);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export {
  login,
  getUserID,
  authenticateToken,
  createToken,
  deleteToken,
  regiter,
};
