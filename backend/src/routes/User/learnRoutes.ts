import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import {
  addFlashcardToLearnController,
  getFlashCardLearnController,
  notRemenberFlashcardController,
  remenberFlashcardController,
  resetLearnController,
  saveProcessController,
} from "../../controllers/User/learnController";
import { authenticateToken } from "../../middleware/authMiddleware";

const learnRouter = Router();
learnRouter.all("*", (req: Request, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
});
learnRouter.post(
  "/add-flashcard-to-learn/:list_id",
  addFlashcardToLearnController
);
learnRouter.post("/remenber-flashcard", remenberFlashcardController);
learnRouter.post("/not-remenber-flashcard", notRemenberFlashcardController);
learnRouter.post("/save-process", saveProcessController);
learnRouter.get("/get-flashcard-learn/:list_id", getFlashCardLearnController);
learnRouter.get("/reset-learn/:list_id", resetLearnController);

export default learnRouter;
