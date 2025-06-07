import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../services/User/authService.js";
import checktokenVersion from "../utils/checkTokenVersion.js";

dotenv.config();

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  //   const whitelist = ["/login", "/register"];

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Thiếu token" });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(403).json({ error: "Token hết hạn" });
          return;
        } else {
          res.status(403).json({ error: "Token không hợp lệ" });
          return;
        }
      }
      const userCurrent = user as UserPayload;
      if (
        !(await checktokenVersion(
          userCurrent.user_id,
          userCurrent.tokenVersion
        ))
      ) {
        res.status(403).json({ error: "Token không hợp lệ" });
        return;
      }
      (req as any).user = userCurrent;
      next();
    }
  );
};

export { authenticateToken };
