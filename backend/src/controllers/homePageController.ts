import { Request, Response } from "express";
import {
  getRecentClassesService,
  getRecentFlashcardsService,
  getTopAuthorService,
  getTopTopicsByUserService,
} from "../services/homePageService";
const getRecentClasses = async (req: Request, res: Response): Promise<any> => {
  try {
    const userID = req.body.user.user_id;
    if (!userID) {
      return res.status(403).json({ error: "Can not get Data" });
    }
    const data = await getRecentClassesService(userID);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const getTopAuthor = async (_req: Request, res: Response): Promise<any> => {
  try {
    const data = await getTopAuthorService();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const getRecentFlashcards = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userID = req.body.user.user_id;
    const data = await getRecentFlashcardsService(userID);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
const getTopTopicsByUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userID = req.body.user.user_id;
    const data = await getTopTopicsByUserService(userID);
    res.status(200).json(data);
  } catch (error) {
    console.log("lỗi lấy topic :", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export {
  getRecentClasses,
  getRecentFlashcards,
  getTopAuthor,
  getTopTopicsByUser,
};
