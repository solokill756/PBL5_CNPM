import { Router } from "express";
import { login, regiter } from "../controllers/authenticationController.js";
const authRoutes = new Router();
authRoutes.post("/login", login);
authRoutes.post("/regiter", regiter);
export default authRoutes;
