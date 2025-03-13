import { Router, Request, Response } from "express";
import { login , register , logout } from "../controllers/authenticationController.js";

const authRoutes = Router();

authRoutes.post("/login", (req: Request, res: Response) => login(req, res));
authRoutes.post("/register", (req: Request, res: Response) => register(req, res));

authRoutes.get("/logout", (req: Request, res: Response) => logout(req, res));

export default authRoutes;
