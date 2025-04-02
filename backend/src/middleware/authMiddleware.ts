import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { refreshAccessToken } from "../helpers/tokenHelper.js";

dotenv.config();

interface UserPayload {
  id: string;
  email: string;
  username: string;
  full_name: string;
  // Add other user properties if needed
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  //   const whitelist = ["/login", "/register"];

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Thiếu token" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies?.refreshToken || req.headers["x-refresh-token"];
        if (!refreshToken) {
          res.status(401).json({ error: "Thiếu refresh token" });
          return;
        }
        
        // Gọi service để tạo access token mới từ refresh token
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (!newAccessToken) {
          res.status(403).json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
          return;
        }

        // Gửi access token mới về client
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);

        req.body.user = user as UserPayload;
        next();
        return;
      } else if (err.name === "JsonWebTokenError") {
        res.status(403).json({ error: "Token không hợp lệ" });
        return;
      } else {
        res.status(403).json({ error: "Lỗi xác thực token" });
        return;
      }
    }
    req.body.user = user as UserPayload;
    next();
  });
};

export { authenticateToken };
