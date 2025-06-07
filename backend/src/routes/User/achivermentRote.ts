import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import achivermentController from "../../controllers/User/achivermentController";

const achivermentRoutes = Router();

achivermentRoutes.all(
  "*",
  (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
  }
);

achivermentRoutes.get("/", achivermentController.getAllAchievement);
achivermentRoutes.get(
  "/achievement_detail/:achievementId",
  achivermentController.getAchievementByAchievementId
);
achivermentRoutes.get(
  "/level/:level",
  achivermentController.getAchivementOfLevel
);
achivermentRoutes.post("/unlock", achivermentController.unlockAchievement);
achivermentRoutes.get("/user", achivermentController.getAchievementByUserId);
export default achivermentRoutes;
