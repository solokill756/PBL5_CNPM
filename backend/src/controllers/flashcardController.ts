import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../middleware/responseFormatter';
import { getFlashcardByListId, likeFlashcard, rateListFlashcard, unlikeFlashcard, updateLastReview, updateReviewCount, checkRateFlashcard } from '../services/flashcardPageService';
const getFlashcardByListIdController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    const { list_id } = req.params;
    try {
        const flashcards = await getFlashcardByListId(list_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const rateListFlashcardController = async (req: Request, res: Response) => {
    const { list_id, rate } = req.body;
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    try {
        const flashcards = await rateListFlashcard(list_id, rate, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const likeFlashcardController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    const { flashcard_id } = req.body;
    try {
        const flashcards = await likeFlashcard(flashcard_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const unlikeFlashcardController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    const { flashcard_id } = req.body;
    try {
        const flashcards = await unlikeFlashcard(flashcard_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};

const updateReviewCountController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    const { flashcard_id } = req.body;
    try {
        const flashcards = await updateReviewCount(flashcard_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const updateLastReviewController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    const { flashcard_id } = req.body;
    try {
        const flashcards = await updateLastReview(flashcard_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};

const checkRateFlashcardController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    const { list_id } = req.body;
    try {
        const flashcards = await checkRateFlashcard(list_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
export { rateListFlashcardController, likeFlashcardController, unlikeFlashcardController, updateReviewCountController, updateLastReviewController, getFlashcardByListIdController, checkRateFlashcardController };
