import { Request, Response } from "express";
import {
  getRecentClassesService,
  getRecentFlashcardsService,
  getTopAuthorService,
  getTopTopicsByUserService,
  searchDataService,
} from "../../services/User/homePageService";
import { sendError, sendSuccess } from "../../middleware/responseFormatter";
const getRecentClasses = async (req: Request, res: Response): Promise<any> => {
  try {
    const userID = (req as any).user.user_id;
    if (!userID) {
      return res.status(403).json({ error: "Can not get Data" });
    }
    const data = await getRecentClassesService(userID);
    sendSuccess(res, data);
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const getTopAuthor = async (_req: Request, res: Response): Promise<any> => {
  try {
    const data = await getTopAuthorService();
    sendSuccess(res, data);
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};

const getRecentFlashcards = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userID = (req as any).user.user_id;
    const data = await getRecentFlashcardsService(userID);
    sendSuccess(res, data);
  } catch (error) {
    console.log(error);
    sendError(res, "Lỗi server", 500);
  }
};
const getTopTopicsByUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userID = (req as any).user.user_id;
    const level = (req as any).user.level;
    const data = await getTopTopicsByUserService(userID, level);
    sendSuccess(res, data);
  } catch (error) {
    console.log("lỗi lấy topic :", error);
    sendError(res, "Lỗi server", 500);
  }
};

const searchData = async (req: Request, res: Response): Promise<any> => {
  try {
    const value = req.query.value;
    if (typeof value !== "string") {
      sendError(res, "Invalid search value", 400);
      return;
    }
    const data = await searchDataService(value.trim());
    sendSuccess(res, data);
  } catch (error: any) {
    console.log(error);
    sendError(res, error.message, 500);
  }
};

export {
  getRecentClasses,
  getRecentFlashcards,
  getTopAuthor,
  getTopTopicsByUser,
  searchData,
};
