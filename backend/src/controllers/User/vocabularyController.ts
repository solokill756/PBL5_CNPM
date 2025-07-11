import vocabularyService from "../../services/User/vocabularyService";
import { sendSuccess, sendError } from "../../middleware/responseFormatter";
import { Request, Response } from "express";
const getSimilarVocabulary = async (req: Request, res: Response) => {
  try {
    const { word, language } = req.body;
    const vocabularies = await vocabularyService.getSimilarVocabulary(
      word,
      language
    );
    sendSuccess(res, vocabularies);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const getVocabularyByTopic = async (req: Request, res: Response) => {
  try {
    const { topic_id } = req.params;
    const user_id = (req as any).user.user_id;
    const vocabularies = await vocabularyService.getVocabularyByTopic(
      topic_id,
      user_id
    );
    sendSuccess(res, vocabularies);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const getHistorySearch = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;
    const history = await vocabularyService.getHistorySearch(user_id);
    sendSuccess(res, history);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};
const getAlToFindVocabulary = async (req: Request, res: Response) => {
  try {
    const { word, language } = req.body;
    const user_id = (req as any).user.user_id;
    const vocabularies = await vocabularyService.getAlToFindVocabulary(
      word,
      language,
      user_id
    );
    sendSuccess(res, vocabularies);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const requestNewVocabulary = async (req: Request, res: Response) => {
  try {
    const { word, comment } = req.body;
    const email = (req as any).user.email;
    const data = await vocabularyService.requestNewVocabulary(
      word,
      email,
      comment
    );
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const getAllTopic = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;
    const topics = await vocabularyService.getAllTopic(user_id);
    sendSuccess(res, topics);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const addHistorySearch = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;
    const { vocabulary_id } = req.body;
    const history = await vocabularyService.addHistorySearch(
      user_id,
      vocabulary_id
    );
    sendSuccess(res, history);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const checkLevelUser = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;
    const { new_points } = req.body;
    const user = await vocabularyService.checkLevelUser(
      user_id,
      Number(new_points)
    );
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const updateVocabularyUser = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;
    const { vocabulary_id, is_saved, had_learned, topic_id } = req.body;
    const user = await vocabularyService.updateVocabularyUser(
      user_id,
      vocabulary_id,
      topic_id,
      is_saved,
      had_learned
    );
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const getTopicVocabularyByID = async (req: Request, res: Response) => {
  try {
    const { topic_id } = req.params;
    const vocabularies = await vocabularyService.getTopicVocabularyByID(
      topic_id
    );
    sendSuccess(res, vocabularies);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

const getFlashcardOfTopic = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id;
    const { topic_id } = req.params;
    const vocabularies = await vocabularyService.getFlashCardOftopic(
      topic_id,
      user_id
    );
    sendSuccess(res, vocabularies);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const checkTopicHasListFlashcard = async (req: Request, res: Response) => {
  try {
    const { topic_id } = req.params;
    const vocabularies = await vocabularyService.checkTopicHasListFlashcard(
      topic_id
    );
    sendSuccess(res, vocabularies);
  } catch (error) {
    sendError(res, "Lỗi server", 500);
  }
};

export default {
  getSimilarVocabulary,
  getVocabularyByTopic,
  getAlToFindVocabulary,
  requestNewVocabulary,
  getAllTopic,
  getHistorySearch,
  addHistorySearch,
  checkLevelUser,
  updateVocabularyUser,
  getTopicVocabularyByID,
  getFlashcardOfTopic,
  checkTopicHasListFlashcard,
};
