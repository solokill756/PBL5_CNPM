import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { Response, Request, NextFunction } from "express";
import listFlashCardController from "../controllers/listFlashCardController";
const listFlashCardRoute = Router();
listFlashCardRoute.all(
  "*",
  (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, next);
  }
);

listFlashCardRoute.post(
  "/add-list-flashcard",
  listFlashCardController.addListFlashCard
);

listFlashCardRoute.post(
  "/update-list-flashcard/:list_id",
  listFlashCardController.updateListFlashCard
);

listFlashCardRoute.delete(
  "/delete-list-flashcard/:list_id",
  listFlashCardController.deleteListFlashCard
);

export default listFlashCardRoute;
