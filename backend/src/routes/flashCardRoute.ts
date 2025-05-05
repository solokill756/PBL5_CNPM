import { NextFunction, Router, Request, Response } from "express";
import { getFlashcardByListIdController, updateReviewCountController, rateListFlashcardController, unlikeFlashcardController, updateLastReviewController, likeFlashcardController, checkRateFlashcardController,  addListFlashcardToClassController, shareLinkListFlashcardToUserController, getClassOfUserController } from "../controllers/flashcardController";
import { authenticateToken } from "../middleware/authMiddleware";

const flashCardRoutes = Router();
flashCardRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
});
flashCardRoutes.get("/getFlashcardByListId/:list_id", getFlashcardByListIdController);
flashCardRoutes.post("/likeFlashcard", likeFlashcardController);
flashCardRoutes.delete("/unlikeFlashcard", unlikeFlashcardController);
flashCardRoutes.post("/rateListFlashcard", rateListFlashcardController);
flashCardRoutes.post("/updateReviewCount", updateReviewCountController);
flashCardRoutes.post("/updateLastReview", updateLastReviewController);
flashCardRoutes.get("/checkRateFlashcard/:list_id", checkRateFlashcardController);
flashCardRoutes.post("/addListFlashcardToClass", addListFlashcardToClassController);
flashCardRoutes.post("/shareLinkListFlashcardToUser", shareLinkListFlashcardToUserController);
flashCardRoutes.get("/getClassOfUser", getClassOfUserController);
export default flashCardRoutes;

