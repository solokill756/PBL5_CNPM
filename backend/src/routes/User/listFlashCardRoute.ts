import { Router } from "express";

import { Response, Request, NextFunction } from "express";
import { authenticateToken } from "../../middleware/authMiddleware";
import listFlashCardController from "../../controllers/User/listFlashCardController";

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

listFlashCardRoute.get(
  "/get-list-foget-flashcard",
  listFlashCardController.getForgetFlashcard
);

export default listFlashCardRoute;
