import { Router } from "express";
import {
  authenticateToken,
  createToken,
  deleteToken,
  getUserID,
  login,
} from "../controllers/authenticationController.js";

const authRoutes = new Router();
authRoutes.get("/login", login);
authRoutes.get("/getUserID", authenticateToken, getUserID);
authRoutes.post("/createToken", createToken);
authRoutes.delete("/deleteToken", deleteToken);
export default authRoutes;
