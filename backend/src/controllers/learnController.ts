import { Request, Response } from "express";
import {
  addFlashcardToLearn,
  getFlashCardLearn,
  notRemenberFlashcard,
  remenberFlashcard,
  resetLearn,
  saveProcess,
} from "../services/learnService";
import { sendError, sendSuccess } from "../middleware/responseFormatter";

const addFlashcardToLearnController = async (req: Request, res: Response) => {
  try {
    const { list_id } = req.params;
    const user_id = (req as any).user.user_id;
    const flashcard = await addFlashcardToLearn(list_id, user_id);
    sendSuccess(res, flashcard);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const remenberFlashcardController = async (req: Request, res: Response) => {
  try {
    const { flashcard_ids } = req.body;
    const user_id = (req as any).user.user_id;
    const flashcard = await remenberFlashcard(flashcard_ids, user_id);
    sendSuccess(res, flashcard);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const notRemenberFlashcardController = async (req: Request, res: Response) => {
  try {
    const { flashcard_ids } = req.body;
    const user_id = (req as any).user.user_id;
    const flashcard = await notRemenberFlashcard(flashcard_ids, user_id);
    sendSuccess(res, flashcard);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const saveProcessController = async (req: Request, res: Response) => {
  try {
    const { list_id, number_word_forget, flashcard_id } = req.body;
    const user_id = (req as any).user.user_id;
    const process = await saveProcess(
      list_id,
      user_id,
      Number(number_word_forget),
      flashcard_id
    );
    sendSuccess(res, process);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const getFlashCardLearnController = async (req: Request, res: Response) => {
  try {
    const { list_id } = req.params;
    const user_id = (req as any).user.user_id;
    const flashcard = await getFlashCardLearn(list_id, user_id);
    sendSuccess(res, flashcard);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

const resetLearnController = async (req: Request, res: Response) => {
  try {
    const { list_id } = req.params;
    const user_id = (req as any).user.user_id;
    const reset = await resetLearn(list_id, user_id);
    sendSuccess(res, reset);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
};

export {
  addFlashcardToLearnController,
  remenberFlashcardController,
  notRemenberFlashcardController,
  saveProcessController,
  getFlashCardLearnController,
  resetLearnController,
};
