import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { refreshAccessToken } from "../services/authService.js";
dotenv.config();
const authenticateToken = (req, res, next) => {
  //   const whitelist = ["/login", "/register"];

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Thiếu token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken =
          req.cookies?.refreshToken || req.headers["x-refresh-token"];
        if (!refreshToken) {
          return res.status(401).json({ error: "Thiếu refresh token" });
        }

        // Gọi service để tạo access token mới từ refresh token
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (!newAccessToken) {
          return res
            .status(403)
            .json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
        }

        // Gửi access token mới về client
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        req.user = user;
        return next();
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ error: "Token không hợp lệ" });
      } else {
        return res.status(403).json({ error: "Lỗi xác thực token" });
      }
    }
    req.user = user;
    next();
  });
};

export { authenticateToken };
