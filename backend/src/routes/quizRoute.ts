import { NextFunction, Router, Request, Response } from "express";
import { generateQuizController, saveResultQuizController } from "../controllers/quizController";
import { authenticateToken } from "../middleware/authMiddleware";

const quizRoutes = Router();
quizRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
});
quizRoutes.post("/generateQuiz", generateQuizController);
quizRoutes.post("/saveResultQuiz", saveResultQuizController);

export default quizRoutes;