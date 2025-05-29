import { Request, Response } from "express";
import achivermentService from "../services/achivermentService";
import { sendError, sendSuccess } from "../middleware/responseFormatter";

const getAllAchievement = async (_req: Request, res: Response) => {
    try {
        const achievement = await achivermentService.getAllAchievement();
        sendSuccess(res, achievement);  
    } catch (error) {
        sendError(res, "Lỗi server");
    }
}

const getAchievementByUserId = async (req: Request, res: Response) => {
    try {
        const user_id = (req as any).user.user_id;
        const achievement = await achivermentService.getAchievementByUserId(user_id);
        sendSuccess(res, achievement);
    } catch (error) {
        sendError(res, "Lỗi server");
    }
}

const getAchievementByAchievementId = async (req: Request, res: Response) => {
    try {
        const achievement_id = req.params.achievementId;
        const achievement = await achivermentService.getAchievementByAchievementId(achievement_id);
        sendSuccess(res, achievement);
    } catch (error) {
        sendError(res, "Lỗi server");
    }
}

const getAchivementOfLevel = async (req: Request, res: Response) => {
    try {
        const level = Number(req.params.level);
        const achievement = await achivermentService.getAchivementOfLevel(Number(level));
        sendSuccess(res, achievement);
    } catch (error) {
        sendError(res, "Lỗi server");
    }
}

const unlockAchievement = async (req: Request, res: Response) => {
    try {
        const user_id = (req as any).user.user_id;
        const user_level = req.body.user_level;
        const achievement = await achivermentService.unlockAchievement(user_id, Number(user_level));
        sendSuccess(res, achievement);
    } catch (error) {
        sendError(res, "Lỗi server");
    }
}



export default { getAllAchievement, getAchievementByUserId, getAchievementByAchievementId, getAchivementOfLevel, unlockAchievement};
