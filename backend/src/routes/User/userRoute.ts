import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { getAllUsers, getUser } from "../../controllers/User/userController.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";
// import all controllers
// import SessionController from './app/controllers/SessionController';

const userRoutes = Router();

userRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});

userRoutes.get("/allUsers", (req: Request, res: Response) => {
  getAllUsers(req, res);
});

userRoutes.get("/:id", (req: Request, res: Response) => {
  getUser(req, res);
});

export default userRoutes;
