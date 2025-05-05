import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../middleware/responseFormatter';
import { getFlashcardByListId, likeFlashcard, rateListFlashcard, unlikeFlashcard, updateLastReview, updateReviewCount, checkRateFlashcard, addListFlashcardToClass, shareLinkListFlashcardToUser, getClassOfUser } from '../services/flashcardPageService';
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
    const { list_id, rate, comment } = req.body;
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    try {
        const flashcards = await rateListFlashcard(list_id, rate, userId , comment);
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
    const {list_id} = req.params;
    try {
        const flashcards = await checkRateFlashcard(list_id, userId);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const addListFlashcardToClassController = async (req: Request, res: Response) => {
    const { list_id, classes } = req.body;
    try {
        const flashcards = await addListFlashcardToClass(list_id, classes);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const shareLinkListFlashcardToUserController = async (req: Request, res: Response) => {
    const { list_id, email } = req.body;
    try {
        const flashcards = await shareLinkListFlashcardToUser(list_id, email);
        sendSuccess(res, flashcards);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
const getClassOfUserController = async (req: Request, res: Response) => {
    const userId = (req as any).user.user_id;
    if (!userId) {
        sendError(res, "Unauthorized", 401);
        return;
    }
    try {
        const classes = await getClassOfUser(userId);
        sendSuccess(res, classes);
    } catch (error: any) {
        sendError(res, error.message, 500);
    }
};
 



export { rateListFlashcardController, likeFlashcardController, unlikeFlashcardController, updateReviewCountController, updateLastReviewController, getFlashcardByListIdController, checkRateFlashcardController, addListFlashcardToClassController, shareLinkListFlashcardToUserController, getClassOfUserController };
