import { NextFunction, Router } from "express";
import achivermentController from "../controllers/achivermentController";
import { authenticateToken } from "../middleware/authMiddleware";
import { Request, Response } from "express";

const achivermentRoutes = Router();


achivermentRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
});

achivermentRoutes.get("/", achivermentController.getAllAchievement);
achivermentRoutes.get("/achievement_detail/:achievementId", achivermentController.getAchievementByAchievementId);
achivermentRoutes.get("/level/:level", achivermentController.getAchivementOfLevel);
achivermentRoutes.post("/unlock", achivermentController.unlockAchievement);
achivermentRoutes.get("/user", achivermentController.getAchievementByUserId);
export default achivermentRoutes;

