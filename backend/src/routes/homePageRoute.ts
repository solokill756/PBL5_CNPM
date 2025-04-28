import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getRecentClasses,
  getRecentFlashcards,
  getTopAuthor,
  getTopTopicsByUser,
} from "../controllers/homePageController";

const homePageRoutes = Router();
homePageRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});

homePageRoutes.get("/recentClasses", (req: Request, res: Response) => {
  getRecentClasses(req, res);
});

homePageRoutes.get("/recentFlashcard", (req: Request, res: Response) => {
  getRecentFlashcards(req, res);
});
homePageRoutes.get("/topAuthor", (req: Request, res: Response) => {
  getTopAuthor(req, res);
});

homePageRoutes.get("/getTopTopicsByUser", (req: Request, res: Response) => {
  getTopTopicsByUser(req, res);
});

export default homePageRoutes;
