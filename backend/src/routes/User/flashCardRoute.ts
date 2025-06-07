import { NextFunction, Router, Request, Response } from "express";
import {
  getFlashcardByListIdController,
  updateReviewCountController,
  rateListFlashcardController,
  unlikeFlashcardController,
  updateLastReviewController,
  likeFlashcardController,
  checkRateFlashcardController,
  addListFlashcardToClassController,
  shareLinkListFlashcardToUserController,
  getClassOfUserController,
  getAllExplanationController,
} from "../../controllers/User/flashcardController";
import { authenticateToken } from "../../middleware/authMiddleware";

const flashCardRoutes = Router();
flashCardRoutes.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});
flashCardRoutes.get(
  "/getFlashcardByListId/:list_id",
  getFlashcardByListIdController
);
flashCardRoutes.post("/likeFlashcard", likeFlashcardController);
flashCardRoutes.delete(
  "/unlikeFlashcard/:flashcard_id",
  unlikeFlashcardController
);
flashCardRoutes.post("/rateListFlashcard", rateListFlashcardController);
flashCardRoutes.post("/updateReviewCount", updateReviewCountController);
flashCardRoutes.post("/updateLastReview", updateLastReviewController);
flashCardRoutes.get(
  "/checkRateFlashcard/:list_id",
  checkRateFlashcardController
);
flashCardRoutes.post(
  "/addListFlashcardToClass",
  addListFlashcardToClassController
);
flashCardRoutes.post(
  "/shareLinkListFlashcardToUser",
  shareLinkListFlashcardToUserController
);
flashCardRoutes.get("/getClassOfUser", getClassOfUserController);
flashCardRoutes.get(
  "/getAlExplanation/:flashcard_id",
  getAllExplanationController
);
export default flashCardRoutes;
